import type { IApiResponse } from '~/types/global.types'

import { Elysia } from 'elysia'

import { config } from '~/config'
import { logger } from '~/utils/logger'

/**
 * API 错误类
 *
 * 继承自Error，包含错误码信息
 * 中间件会自动检测此类型的错误并根据错误码设置相应的HTTP状态码
 */
export class ApiError extends Error {
    public readonly code: number

    constructor(code: number, message: string) {
        super(message)
        this.code = code
        this.name = 'ApiError'
    }
}

/**
 * 规范化 Swagger / 静态资源等路径前缀
 */
function normalizeBasePath(path: string): string {
    if (path.startsWith('/'))
        return path
    return `/${path}`
}

/**
 * 判断当前请求是否应跳过统一响应包装（文档站、静态资源等）
 */
function shouldSkipResponseWrap(requestUrl: string): boolean {
    const { pathname } = new URL(requestUrl)
    const docPath = normalizeBasePath(config.swagger.path)

    if (pathname === docPath || pathname.startsWith(`${docPath}/`))
        return true
    if (pathname.startsWith(normalizeBasePath(config.static.prefix)))
        return true
    if (pathname.startsWith(normalizeBasePath(config.static.uploadsPrefix)))
        return true
    return false
}

interface IElysiaLikeValidationError {
    readonly customError?: string
    readonly messageValue?: {
        readonly path?: string
        readonly message?: string
    }
}

function isElysiaLikeValidationError(error: unknown): error is IElysiaLikeValidationError {
    return typeof error === 'object' && error !== null
}

/**
 * 从校验错误中提取可读信息
 */
function formatValidationMessage(error: unknown): string {
    if (!isElysiaLikeValidationError(error))
        return '请求参数校验失败'

    if (typeof error.customError === 'string' && error.customError.length > 0)
        return error.customError

    const path = error.messageValue?.path?.replace(/^\//u, '') ?? 'field'
    const message = error.messageValue?.message ?? '校验失败'
    return `${path}: ${message}`
}

/**
 * 响应包装中间件
 *
 * 自动将业务处理返回值包装为标准 API 响应格式（见仓库规范 4.1）
 * - 正常数据：{ code: 200, message, data }
 * - 异常：{ code, message, data: null }（HTTP 状态码保持 200，错误码在 body.code）
 */
export const responseWrapperMiddleware = new Elysia({
    name: 'response-wrapper',
})
    .onAfterHandle(({ request, responseValue }) => {
        if (shouldSkipResponseWrap(request.url))
            return responseValue

        if (responseValue instanceof Response)
            return responseValue

        let message = ''
        if (typeof responseValue === 'string')
            message = responseValue

        const successResponse: IApiResponse<typeof responseValue> = {
            code: 200,
            data: responseValue,
            message,
        }

        return successResponse
    })
    .onError(({ error, request, set, code }) => {
        if (shouldSkipResponseWrap(request.url))
            throw error

        let errorMessage = '服务器内部错误'
        let statusCode = 500

        if (error instanceof ApiError) {
            errorMessage = error.message
            statusCode = error.code
        }
        else if (code === 'VALIDATION') {
            errorMessage = formatValidationMessage(error)
            statusCode = 422
            logger.warn({ error }, '请求校验失败')
        }
        else if (error instanceof Error) {
            errorMessage = error.message
        }
        else {
            errorMessage = String(error)
        }

        set.status = 200

        const errorResponse: IApiResponse<null> = {
            code: statusCode,
            message: errorMessage,
            data: null,
        }

        return errorResponse
    })
    .as('scoped')

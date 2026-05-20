import { Elysia } from 'elysia'

import { getHealthPayload } from './health.service'

/**
 * 健康检查路由（无业务数据库依赖，便于探活）
 * 注：此处不使用 Elysia response Schema 校验，避免与全局响应包装后的外层结构冲突
 */
export const healthController = new Elysia({ name: 'health', prefix: '/api' })
    .get(
        '/health',
        () => getHealthPayload(),
        {
            detail: {
                summary: '健康检查',
                tags: ['system'],
            },
        },
    )

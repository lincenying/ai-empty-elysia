/**
 * 全局 API 响应封装（与仓库规范 4.1 一致）
 */
export interface IApiResponse<T = unknown> {
    code: number
    message: string
    data: T | null
}

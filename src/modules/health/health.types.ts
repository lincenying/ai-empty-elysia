/**
 * 健康检查接口返回体
 */
export interface IHealthPayload {
    status: 'ok'
    uptimeSec: number
    timestamp: string
}

import type { IHealthPayload } from './health.types'

const start = Date.now()

/**
 * 组装健康检查数据
 */
export function getHealthPayload(): IHealthPayload {
    return {
        status: 'ok',
        uptimeSec: Math.round((Date.now() - start) / 1000),
        timestamp: new Date().toISOString(),
    }
}

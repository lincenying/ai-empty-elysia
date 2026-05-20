import { cors } from '@elysiajs/cors'

import { config } from '~/config'

/**
 * 创建 CORS 配置（与 convict 中的 methods / credentials 对齐）
 */
export function createCorsConfig() {
    return cors({
        origin: config.cors.origin,
        credentials: config.cors.credentials,
        methods: config.cors.methods,
    })
}

import { existsSync, mkdirSync } from 'node:fs'

import { serverTiming } from '@elysiajs/server-timing'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'

import { config } from '~/config'
import { healthController } from '~/modules/health/health.controller'
import { accessLoggerMiddleware } from '~/plugins/access-logger'
import { createCorsConfig } from '~/plugins/cors'
import { responseWrapperMiddleware } from '~/plugins/response-wrapper'
import { createStaticConfig } from '~/plugins/static'

import '~/db'

const swaggerPathPrefix = config.swagger.path.startsWith('/') ? config.swagger.path : `/${config.swagger.path}`
const swaggerPath = swaggerPathPrefix as '/docs'

/**
 * 确保静态资源、上传目录存在，避免 static 插件启动报错
 */
function ensureRuntimeAssetDirs() {
    for (const dir of [config.static.assetsPath, config.static.uploadsPath]) {
        if (!existsSync(dir))
            mkdirSync(dir, { recursive: true })
    }
}

/**
 * 创建并配置 Elysia 应用实例（插件化装配入口）
 */
export function createApp() {
    ensureRuntimeAssetDirs()
    let app = new Elysia({
        serve: {
            maxRequestBodySize: 1024 * 1024 * 256, // 256MB
        },
    })
        .use(serverTiming())
        .use(createCorsConfig())
        .use(accessLoggerMiddleware)
        .use(
            swagger({
                path: swaggerPath,
                documentation: {
                    info: {
                        title: config.swagger.title,
                        version: config.swagger.version,
                        description: config.swagger.description,
                    },
                },
            }),
        )
        .use(responseWrapperMiddleware)
        .use(healthController)

    for (const plugin of createStaticConfig())
        app = app.use(plugin)

    return app
}

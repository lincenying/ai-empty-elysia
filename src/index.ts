import { config } from '~/config'
import { logger } from '~/utils/logger'

import { createApp } from './app'

const app = createApp()

app.listen({
    hostname: config.server.host,
    port: config.server.port,
})

logger.info(`🚀 服务器运行在 http://${app.server?.hostname}:${app.server?.port}`)

if (config.server.nodeEnv === 'development') {
    const docPath = config.swagger.path.startsWith('/') ? config.swagger.path : `/${config.swagger.path}`
    logger.info(`📋 API文档地址: http://${app.server?.hostname}:${app.server?.port}${docPath}`)
}

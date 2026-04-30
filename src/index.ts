/* eslint-disable node/prefer-global/process */
import { serverTiming } from '@elysiajs/server-timing'
import { Elysia } from 'elysia'

import { config } from '~/config'
import { logger } from '~/utils/logger'
import { createStaticConfig } from './plugins/static'

const app = new Elysia({
    serve: {
        maxRequestBodySize: 1024 * 1024 * 256, // 256MB
    },
})
    .use(serverTiming())
    .use(createStaticConfig())

app.listen(config.server.port)

// 获取正确的访问信息
logger.info(`🚀 服务器运行在 http://${app.server?.hostname}:${app.server?.port}`)

if (process.env.NODE_ENV === 'development') {
    logger.info(`📋 API文档地址: http://${app.server?.hostname}:${app.server?.port}${config.swagger.path}`)
}

import { staticPlugin } from '@elysiajs/static'

import { config } from '~/config'

/**
 * 创建静态文件配置
 */
export function createStaticConfig() {
    return [
        staticPlugin({
            // 静态文件目录（相对于项目根目录）
            assets: config.static.assetsPath,
            // 访问路径前缀
            prefix: config.static.prefix,
            // 是否在找不到路由时返回 index.html（适用于 SPA）
            indexHTML: false,
            // 自定义响应头
            headers: {
                'Cache-Control': `public, max-age=${3600 * 24 * 30}`, // 30 days
            },
        }),
        staticPlugin({
            assets: config.static.uploadsPath,
            prefix: config.static.uploadsPrefix,
            indexHTML: false,
            headers: {
                'Cache-Control': `public, max-age=${3600 * 24 * 30}`, // 30 days
            },
        }),
    ]
}

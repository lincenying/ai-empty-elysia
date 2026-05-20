/**
 * 将应用打包到 dist 目录（非单文件可执行，便于配合 PM2 / 直接 bun 运行）
 */
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { build } from 'bun'

async function main() {
    await mkdir('dist', { recursive: true })

    const result = await build({
        entrypoints: ['./src/index.ts'],
        minify: true,
        outdir: './dist',
        sourcemap: 'external',
        target: 'bun',
    })

    if (!result.success) {
        console.error(result.logs)
        process.exit(1)
    }

    console.log('✅ build 完成，入口: dist/index.js')
}

main().catch((error: unknown) => {
    console.error(error)
    process.exit(1)
})

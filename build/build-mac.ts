/**
 * 编译为 macOS 可执行文件（当前运行 bun 的架构）
 */
import process from 'node:process'

import { $ } from 'bun'

async function main() {
    const proc = await $`bun build --compile --minify-whitespace --minify-syntax --outfile dist/server-macos src/index.ts`.nothrow()

    if (proc.exitCode !== 0) {
        console.error(proc.stderr.toString())
        process.exit(proc.exitCode)
    }

    console.log('✅ 已生成 dist/server-macos')
}

main().catch((error: unknown) => {
    console.error(error)
    process.exit(1)
})

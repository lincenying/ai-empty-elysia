/**
 * 交叉编译为 Linux x64 可执行文件
 */
import process from 'node:process'

import { $ } from 'bun'

async function main() {
    const proc = await $`bun build --compile --target=bun-linux-x64 --minify-whitespace --minify-syntax --outfile dist/server-linux-x64 src/index.ts`.nothrow()

    if (proc.exitCode !== 0) {
        console.error(proc.stderr.toString())
        process.exit(proc.exitCode)
    }

    console.log('✅ 已生成 dist/server-linux-x64')
}

main().catch((error: unknown) => {
    console.error(error)
    process.exit(1)
})

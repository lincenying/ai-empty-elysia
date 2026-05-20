/**
 * 初始化本地环境：若不存在 `.env`，则从 `.env.example` 复制一份
 */
import { access, copyFile } from 'node:fs/promises'
import process from 'node:process'

const examplePath = '.env.example'
const targetPath = '.env'

async function main() {
    try {
        await access(targetPath)
        console.log(`📋 ${targetPath} 已存在，跳过初始化`)
    }
    catch {
        await copyFile(examplePath, targetPath)
        console.log(`✅ 已从 ${examplePath} 创建 ${targetPath}，请修改其中的敏感配置`)
    }
}

main().catch((error: unknown) => {
    console.error(error)
    process.exit(1)
})

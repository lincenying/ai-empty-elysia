import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

import { Database } from 'bun:sqlite'
import { drizzle as drizzleSqlite } from 'drizzle-orm/bun-sqlite'
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres'
import pg from 'pg'

import { config } from '~/config'

import * as postgresSchema from './schema/postgres'
import * as sqliteSchema from './schema/sqlite'

/**
 * 解析当前进程应使用的数据库方言（auto：非 production 使用 sqlite，否则 postgres）
 */
function resolveDialect(): 'postgres' | 'sqlite' {
    if (config.db.dialect === 'sqlite' || config.db.dialect === 'postgres')
        return config.db.dialect
    return config.server.nodeEnv === 'production' ? 'postgres' : 'sqlite'
}

/**
 * 创建 Drizzle 数据库客户端（单例）
 */
function createDbInstance() {
    const dialect = resolveDialect()

    if (dialect === 'sqlite') {
        const sqlitePath = config.db.sqlite
        const dir = dirname(sqlitePath)
        if (!existsSync(dir))
            mkdirSync(dir, { recursive: true })

        const sqlite = new Database(sqlitePath)
        return drizzleSqlite(sqlite, { schema: sqliteSchema })
    }

    const pool = new pg.Pool({
        host: config.db.postgre_host,
        port: config.db.postgre_port,
        user: config.db.postgre_user,
        password: config.db.postgre_password,
        database: config.db.postgre_db,
    })

    return drizzlePg(pool, { schema: postgresSchema })
}

export const db = createDbInstance()

export type IDbInstance = ReturnType<typeof createDbInstance>

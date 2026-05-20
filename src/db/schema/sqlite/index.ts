import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * 模板表示例表（开发环境 BunSQLite）
 */
export const greetings = sqliteTable('greetings', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    message: text('message').notNull().default('hello'),
})

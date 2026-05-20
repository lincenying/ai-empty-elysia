import { pgTable, serial, text } from 'drizzle-orm/pg-core'

/**
 * 模板表示例表（生产环境 PostgreSQL）
 */
export const greetings = pgTable('greetings', {
    id: serial('id').primaryKey(),
    message: text('message').notNull().default('hello'),
})

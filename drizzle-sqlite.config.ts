import { defineConfig } from 'drizzle-kit'

import { config } from './src/config/index'

export default defineConfig({
    dialect: 'sqlite',
    schema: './src/db/schema/sqlite/index.ts',
    out: './drizzle-sqlite',
    dbCredentials: {
        url: config.db.sqlite,
    },
    verbose: true,
    strict: true,
})

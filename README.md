# Elysia API 模板

Bun + Elysia + Drizzle（开发 SQLite / 生产 PostgreSQL）+ Convict 配置 + Swagger 文档。

## 快速开始

```bash
bun install
bun run init:config   # 若无 .env，则从 .env.example 复制
bun run db:sqlite:migrate
bun run dev
```

- 健康检查：`GET http://localhost:4000/api/health`
- OpenAPI：`http://localhost:4000/docs`（开发环境日志也会打印该地址）

## 数据库

- **开发（默认）**：`bun run db:sqlite:generate` / `bun run db:sqlite:migrate`（`drizzle-kit` 依赖 `better-sqlite3` 连接本地 SQLite，已作为 devDependency 安装）
- **生产**：配置 `NODE_ENV=production` 与 `POSTGRES_*`，执行 `bun run db:postgre:generate` / `bun run db:postgre:migrate`
- 方言可用 `DB_DIALECT` 强制指定为 `sqlite` 或 `postgres`（覆盖 auto 规则）

## 构建与 Docker

```bash
bun run build                  # 输出 dist/index.js
bun run build:compile:mac      # 单文件可执行（当前平台）
./deploy-prod.sh               # Docker Compose 启动 API + PostgreSQL
```

容器内默认在启动前执行 `db:postgre:migrate`（可通过环境变量 `SKIP_DB_MIGRATE=1` 跳过）。

## 目录约定

业务按模块放在 `src/modules/<name>/`，公共插件在 `src/plugins/`，表结构在 `src/db/schema/`。

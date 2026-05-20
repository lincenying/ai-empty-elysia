# 变更记录

## 2026-05-20 14:37:44

### 改动内容

1. **应用装配**：新增 `src/app.ts`，统一挂载 `serverTiming`、CORS（含 `methods`）、访问日志、Swagger、响应包装、健康检查模块与双静态资源插件；`src/index.ts` 仅负责监听与日志。
2. **规范响应**：新增 `src/types/global.types.ts`（`IApiResponse`），重写 `response-wrapper`：与文档 4.1 对齐、去除 `any`、跳过 `/docs` 与静态前缀路径、校验错误使用 `logger` 与 422。
3. **数据库模板**：新增 `src/db/`（SQLite / PostgreSQL 双 schema、`DB_DIALECT=auto|sqlite|postgres`）、`drizzle-sqlite.config.ts`，修正 `drizzle.config.ts` 路径；生成并保留 `drizzle-postgre/`、`drizzle-sqlite/` 迁移；`db:sqlite:migrate` 增加 `better-sqlite3`（dev）以满足 drizzle-kit 连接需求。
4. **配置与文案**：`config/schema.ts` 与 `development.yaml` / `production.yaml` 改为中性应用名与默认库名 `app`、弱默认密码占位；静态资源增加 `uploadsPath` / `uploadsPrefix`。
5. **健康检查**：新增 `src/modules/health/`（controller/service/types）；启动时 `ensureRuntimeAssetDirs` 创建 `public` / `uploads` 目录避免 static 插件报错。
6. **构建与初始化**：补齐 `build/build.ts` 及 mac/linux/win 编译脚本、`src/init.ts`（从 `.env.example` 复制 `.env`）。
7. **Docker / 编排**：重写 `Dockerfile`（不在构建阶段误跑迁移）、`entrypoint-api.sh`（可选 `SKIP_DB_MIGRATE`）、`docker-compose.yml`（移除无效 mongo 依赖、API 连 `api_postgres`、健康检查 YAML 符合 lint）；同步 `deploy-prod.sh` 端口与库名。
8. **工程卫生**：`.gitignore` 增加 `.env`（保留 `.env.example`）、移除忽略 `drizzle-*` 以便提交迁移；新增 `.env.example`、`README.md`、`public/.gitkeep`、`.data/.gitkeep`；`tsconfig` 增加 `ignoreDeprecations: "6.0"`；`drizzle-sqlite.config.ts` 使用无扩展导入以通过 tsc。

### Commit message

```
feat: 完善 Elysia 模板装配与双环境数据库基建
```

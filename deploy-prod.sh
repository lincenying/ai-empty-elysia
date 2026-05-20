#!/usr/bin/env bash
# 一键构建并启动生产栈：先起 PostgreSQL，再整体 compose up（API 入口可选执行迁移）
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

COMPOSE_FILE="docker-compose.yml"
COMPOSE_FILES=(-f "$COMPOSE_FILE")

echo ">>> 启动 PostgreSQL"
docker compose "${COMPOSE_FILES[@]}" up -d api_postgres

echo ">>> docker compose ${COMPOSE_FILES[*]} build"
docker compose "${COMPOSE_FILES[@]}" build

PG_USER="postgres"
PG_DB="app"
echo ">>> 等待 PostgreSQL 就绪 (${PG_USER} / ${PG_DB})"
pg_ok=0
for _ in $(seq 1 60); do
  if docker compose "${COMPOSE_FILES[@]}" exec -T api_postgres pg_isready -U "$PG_USER" -d "$PG_DB" >/dev/null 2>&1; then
    pg_ok=1
    break
  fi
  sleep 2
done
if [[ "$pg_ok" -ne 1 ]]; then
  echo "错误：PostgreSQL 未在约 2 分钟内就绪，请查看: docker compose ${COMPOSE_FILES[*]} logs api_postgres"
  exit 1
fi

echo ">>> docker compose ${COMPOSE_FILES[*]} up -d"
docker compose "${COMPOSE_FILES[@]}" up -d

WEB_PORT="${APP_PORT:-4000}"
echo ""
echo "已启动。API: http://localhost:${WEB_PORT}"
echo "查看日志: docker compose ${COMPOSE_FILES[*]} logs -f api_bun"
echo "停止服务: docker compose ${COMPOSE_FILES[*]} down"
echo ""

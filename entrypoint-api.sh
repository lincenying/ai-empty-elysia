#!/bin/sh
set -e

if [ "${SKIP_DB_MIGRATE:-0}" != "1" ]; then
    echo "[entrypoint] applying postgres migrations"
    bun run db:postgre:migrate
fi

exec "$@"

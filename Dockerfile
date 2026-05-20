FROM oven/bun:1.3 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY ./src ./src
COPY ./config ./config
COPY ./public ./public
COPY ./tsconfig.json ./tsconfig.json
COPY ./drizzle.config.ts ./drizzle.config.ts
COPY ./drizzle-sqlite.config.ts ./drizzle-sqlite.config.ts
COPY ./drizzle-postgre ./drizzle-postgre

ENV NODE_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --outfile server \
    src/index.ts

FROM oven/bun:1.3

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --from=build /app/server ./server
COPY ./config ./config
COPY ./drizzle.config.ts ./drizzle.config.ts
COPY ./drizzle-postgre ./drizzle-postgre
COPY ./src/db/schema/postgres ./src/db/schema/postgres
COPY ./entrypoint-api.sh ./entrypoint-api.sh
RUN chmod +x ./entrypoint-api.sh
COPY ./public ./public

ENV NODE_ENV=production
EXPOSE 4000

ENTRYPOINT ["./entrypoint-api.sh"]
CMD ["./server"]

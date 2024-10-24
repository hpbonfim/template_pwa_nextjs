FROM node:20.18.0-alpine3.20-slim AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production --no-optional

COPY . .

RUN pnpm build --production

FROM node:20.18.0-alpine3.20-slim AS production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.next ./.next

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]
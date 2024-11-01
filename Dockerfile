FROM node:20.18.0-alpine3.20 AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install  --ignore-script

COPY . .

RUN pnpm build

FROM node:20.18.0-alpine3.20 AS production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.next ./.next

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
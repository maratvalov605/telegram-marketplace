# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Optional: build if using TS (не обязательно, если будет tsc-watch в dev)
# RUN npm run build

# Final stage
FROM node:20-alpine

WORKDIR /app

# Только production-зависимости
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/src ./src/

# Запуск в dev-режиме (для локального)
CMD ["npm", "exec", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]
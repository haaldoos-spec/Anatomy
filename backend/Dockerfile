# Build stage
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
# If you have other assets like seed data or static files, copy them here
# COPY --from=builder /app/src/utils/seedData.ts ./src/utils/

EXPOSE 3001

CMD ["node", "dist/server.js"]

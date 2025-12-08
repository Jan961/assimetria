# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps (including devDeps for TypeScript)
COPY package*.json ./
RUN npm ci

# Copy source and tsconfig, then build
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Runtime stage
FROM node:22-alpine

# Non-root user
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

USER app

EXPOSE 3000

CMD ["node", "dist/index.js"]

FROM node:22-alpine AS base
WORKDIR /app

# --- Build ---
FROM base AS build
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Production ---
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 4001
HEALTHCHECK --interval=10s --timeout=5s --retries=3 CMD curl -f http://localhost:4001/health || exit 1
CMD ["node", "dist/main"]

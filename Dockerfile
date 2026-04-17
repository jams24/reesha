# Reesha Wears & Thrift — single-container build
# Frontend is built, then served as static files by the Express backend.

# -------- 1. Build frontend --------
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci
COPY frontend frontend
RUN cd frontend && npm run build

# -------- 2. Runtime image --------
FROM node:20-slim
WORKDIR /app

# OpenSSL is required by Prisma on Debian-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies (postinstall runs `prisma generate`,
# which needs the schema to be present).
COPY backend/package*.json backend/
COPY backend/prisma backend/prisma/
RUN cd backend && npm ci

# Copy the rest of the backend source
COPY backend backend

# Copy the built frontend into the location the Express server expects
COPY --from=frontend-builder /app/frontend/dist frontend/dist

ENV NODE_ENV=production
ENV PORT=5001
EXPOSE 5001

WORKDIR /app/backend
CMD ["npm", "start"]

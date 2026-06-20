FROM node:22-slim AS builder

ARG GIT_COMMIT_SHA=unknown
ARG GIT_COMMIT_DATE=unknown

WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12

LABEL org.opencontainers.image.title="BogDev Blog"
LABEL org.opencontainers.image.description="DevBlog personal blog application"
LABEL org.opencontainers.image.source="https://github.com/ale9420/devbog-blog-front"
LABEL org.opencontainers.image.revision="${GIT_COMMIT_SHA}"
LABEL org.opencontainers.image.created="${GIT_COMMIT_DATE}"

WORKDIR /app

COPY --from=builder --chown=65532:65532 /build/.output /app/.output

ENV NODE_ENV=production \
    PORT=8080 \
    NITRO_PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD ["/nodejs/bin/node", "-e", "fetch('http://localhost:8080/feed.xml').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"]

USER 65532

ENTRYPOINT ["/nodejs/bin/node", ".output/server/index.mjs"]

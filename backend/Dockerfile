# ---- Stage: test (installs dev deps and runs tests when container starts) ----
FROM node:18-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV PORT=8080
# When we run this image in CI, it will execute tests:
CMD ["npm", "test"]

# ---- Stage: runtime (production container) ----
FROM node:18-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "index.js"]
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

# Install Python and OpenCV dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    linux-headers \
    cmake \
    pkgconfig \
    jpeg-dev \
    libpng-dev \
    tiff-dev \
    libwebp-dev \
    openblas-dev \
    && ln -sf python3 /usr/bin/python

# Install OpenCV for Python
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "index.js"]
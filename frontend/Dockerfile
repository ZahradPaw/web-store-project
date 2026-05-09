FROM node:18-alpine

WORKDIR /app/frontend

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

RUN mkdir -p /app/frontend/build && \
    chmod -R 755 /app/frontend/build

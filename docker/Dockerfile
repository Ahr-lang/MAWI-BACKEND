# Build stage
FROM node:alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Development stage
FROM node:alpine AS dev
WORKDIR /usr/src/app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci
# Copy config files and other necessary files, but not src (it's mounted)
COPY tsconfig.json ./
COPY jest.config.js ./
COPY .env* ./
# Note: src is mounted via volume, so not copied here
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage
FROM node:alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /usr/src/app/dist ./dist
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server.js"]

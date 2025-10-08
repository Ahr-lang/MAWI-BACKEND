# Build stage
FROM node:alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source and config
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:alpine AS production

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built app from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Default port (overridable via environment)
ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["node", "dist/server.js"]

# Development stage
FROM node:alpine AS dev

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source and config
COPY . .

# Default port
ENV PORT=3000
EXPOSE 3000

# Start in dev mode
CMD ["npm", "run", "dev"]

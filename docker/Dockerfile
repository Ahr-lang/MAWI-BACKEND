# Use an official Node runtime as a smaller image
FROM node:alpine

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

# Default port (overridable via environment)
ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["node", "dist/server.js"]

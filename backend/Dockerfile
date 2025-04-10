# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Set npm to run in production mode and avoid unnecessary output
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error

# Copy package files first
COPY package*.json ./

# Use npm ci for faster, more reliable installation
RUN npm ci --no-audit --no-fund



# Copy the rest of the application code
COPY . .

# Stage 2: Production stage
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy from build stage
COPY --from=build /app /app

# Add health check for the API
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q --spider http://localhost:5000/health || exit 1

EXPOSE 5000

CMD ["node", "server.js"]
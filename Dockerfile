# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Set environment variables for Node.js 20 compatibility
ENV NODE_ENV=production
ENV NODE_OPTIONS="--openssl-legacy-provider"

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --no-audit --no-fund --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM nginx:1.25.2-alpine

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
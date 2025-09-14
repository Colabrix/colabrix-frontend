# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS runner

# Create non-root user
RUN addgroup --system --gid 1001 appuser
RUN adduser --system --uid 1001 appuser

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Change ownership of nginx files
RUN chown -R appuser:appuser /usr/share/nginx/html
RUN chown -R appuser:appuser /var/cache/nginx
RUN chown -R appuser:appuser /var/log/nginx
RUN chown -R appuser:appuser /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R appuser:appuser /var/run/nginx.pid

# Switch to non-root user
USER appuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
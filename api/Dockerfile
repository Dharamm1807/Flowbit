FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Set permissions
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001 \
  && chown -R nodejs:nodejs /app

USER nodejs

# Expose API port and start server
EXPOSE 8000
CMD ["npm", "start"]

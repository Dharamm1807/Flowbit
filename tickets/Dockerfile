FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Set permissions
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001 \
  && chown -R nodejs:nodejs /app

USER nodejs

# Expose port and start React microfrontend
EXPOSE 3001
CMD ["npm", "start"]

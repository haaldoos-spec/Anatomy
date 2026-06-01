FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3001

# Use production mode
ENV NODE_ENV=production

# Start the application using the compiled files
CMD ["node", "dist/server.js"]

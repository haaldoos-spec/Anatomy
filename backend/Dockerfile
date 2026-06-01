FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
# Install all dependencies including devDependencies for ts-node-dev
RUN npm install

# Copy source
COPY . .

# Disable desktop notifications for ts-node-dev in container
ENV TS_NODE_DEV_NO_NOTIFY=true

# Bind to 0.0.0.0 is important for Docker/Render
ENV HOST=0.0.0.0
# The server.ts already uses process.env.PORT
EXPOSE 3001

# Start the application using ts-node-dev
CMD ["npm", "run", "dev"]

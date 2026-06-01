import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { initDb } from './config/database';
import { setupSocketHandlers } from './services/socketService';

const PORT = process.env.PORT || 3001;

// Initialize Database
initDb().then(() => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  setupSocketHandlers(io);

  const HOST = process.env.HOST || '0.0.0.0';
  server.listen(Number(PORT), HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
  });
}).catch(console.error);

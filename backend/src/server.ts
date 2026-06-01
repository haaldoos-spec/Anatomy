import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { initDb } from './config/database';
import { setupSocketHandlers } from './services/socketService';

const PORT = process.env.PORT || 3001;

// Initialize Database
initDb();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // In production, replace with actual frontend URL
    methods: ['GET', 'POST'],
  },
});

setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

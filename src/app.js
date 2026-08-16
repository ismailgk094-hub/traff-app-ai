const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const config = require('./utils/config');
const gameState = require('./game/gameState');
const socketHandlers = require('./networking/socketHandlers');
const apiRoutes = require('./api/routes');
const autoSave = require('./utils/autoSave');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', apiRoutes);

// Socket.io Setup
io.on('connection', (socket) => {
  logger.info(`Player connected: ${socket.id}`);
  socketHandlers.handleConnection(socket, io);

  socket.on('disconnect', () => {
    logger.info(`Player disconnected: ${socket.id}`);
    socketHandlers.handleDisconnection(socket, io);
  });
});

// Auto-save interval
autoSave.startAutoSave(config.autoSaveInterval);

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at ${promise}: ${reason}`);
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`NodeFlow server running on port ${PORT}`);
  gameState.initialize();
});

module.exports = { app, server, io };
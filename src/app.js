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
const themeManager = require('./ui/themeManager');
const ScriptCommand = require('./scripting/scriptCommands');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Serve theme CSS
app.get('/api/theme/css', (req, res) => {
  const css = themeManager.getCurrentThemeCSS();
  res.type('text/css').send(css);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api', apiRoutes);

// Catch-all for single-page app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Socket.io Setup
io.on('connection', (socket) => {
  logger.info(`Player connected: ${socket.id}`);
  socketHandlers.handleConnection(socket, io);

  socket.on('disconnect', () => {
    logger.info(`Player disconnected: ${socket.id}`);
    socketHandlers.handleDisconnection(socket, io);
  });
});

// Set game state and IO for script commands
ScriptCommand.setGameState(gameState, io);

// Game simulation loop
let gameLoopInterval = null;

function startGameLoop() {
  logger.info('Starting game simulation loop...');
  
  let lastUpdate = Date.now();
  
  gameLoopInterval = setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - lastUpdate) / 1000;
    lastUpdate = now;

    try {
      // Update vehicles
      for (const [vehicleId, vehicle] of gameState.vehicles) {
        if (vehicle.isMoving) {
          vehicle.updatePosition(deltaTime);
        }
      }

      // Broadcast game state periodically
      if (Math.random() < 0.1) {
        io.emit('game:sync', gameState.getState());
      }
    } catch (error) {
      logger.error(`Error in game loop: ${error.message}`);
    }
  }, 1000 / config.simulationTickRate);
}

// Auto-save
function startAutoSave() {
  logger.info('Starting auto-save...');
  autoSave.startAutoSave(gameState);
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at ${promise}: ${reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  autoSave.stopAutoSave();
  
  gameState.saveGameData();
  logger.info('Game state saved');
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`NodeFlow server running on port ${PORT}`);
  logger.info(`Visit http://localhost:${PORT} to play`);
  
  gameState.initialize();
  startGameLoop();
  startAutoSave();
  
  logger.info('All systems initialized');
});

module.exports = { app, server, io };
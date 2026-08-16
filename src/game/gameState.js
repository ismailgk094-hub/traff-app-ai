const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const config = require('../utils/config');

const gameState = {
  initialized: false,
  vehicles: new Map(),
  roads: new Map(),
  intersections: new Map(),
  trafficLights: new Map(),
  players: new Map(),
  scores: {},
  gameMode: 'sandbox',
  isPaused: false,
  currentLevel: 1,

  initialize() {
    logger.info('Initializing game state...');
    this.loadGameData();
    this.initialized = true;
  },

  loadGameData() {
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const saveFile = path.join(dataDir, 'game.json');
    if (fs.existsSync(saveFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(saveFile, 'utf8'));
        this.vehicles = new Map(Object.entries(data.vehicles || {}));
        this.roads = new Map(Object.entries(data.roads || {}));
        this.intersections = new Map(Object.entries(data.intersections || {}));
        this.trafficLights = new Map(Object.entries(data.trafficLights || {}));
        this.scores = data.scores || {};
        logger.info('Game state loaded successfully');
      } catch (err) {
        logger.error(`Failed to load game state: ${err.message}`);
      }
    }
  },

  saveGameData() {
    const dataDir = path.join(__dirname, '../../data');
    const saveFile = path.join(dataDir, 'game.json');

    const data = {
      vehicles: Object.fromEntries(this.vehicles),
      roads: Object.fromEntries(this.roads),
      intersections: Object.fromEntries(this.intersections),
      trafficLights: Object.fromEntries(this.trafficLights),
      scores: this.scores,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(saveFile, JSON.stringify(data, null, 2));
    logger.info('Game state saved');
  },

  addVehicle(vehicleId, vehicleData) {
    if (this.vehicles.size >= config.maxVehicles) {
      logger.warn('Max vehicles reached');
      return false;
    }
    this.vehicles.set(vehicleId, vehicleData);
    return true;
  },

  removeVehicle(vehicleId) {
    return this.vehicles.delete(vehicleId);
  },

  getState() {
    return {
      vehicles: Array.from(this.vehicles.values()),
      roads: Array.from(this.roads.values()),
      intersections: Array.from(this.intersections.values()),
      trafficLights: Array.from(this.trafficLights.values()),
      scores: this.scores,
      gameMode: this.gameMode,
      isPaused: this.isPaused,
      currentLevel: this.currentLevel
    };
  }
};

module.exports = gameState;
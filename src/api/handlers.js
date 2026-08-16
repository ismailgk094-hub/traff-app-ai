const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const gameState = require('../game/gameState');
const scriptEngine = require('../scripting/scriptEngine');
const AccountManager = require('../accounts/accountManager');
const proxyManager = require('../proxies/proxyManager');
const proxyChecker = require('../proxies/proxyChecker');
const webhookManager = require('../networking/webhookManager');
const { generateRandomUsername } = require('../accounts/nameGenerator');

const handlers = {
  // ============ SCRIPT ENDPOINTS ============
  uploadScript: (req, res) => {
    try {
      const { scriptName, scriptContent } = req.body;
      if (!scriptName || !scriptContent) {
        return res.status(400).json({ error: 'scriptName and scriptContent are required' });
      }

      const scriptDir = path.join(__dirname, '../../scripts');
      if (!fs.existsSync(scriptDir)) {
        fs.mkdirSync(scriptDir, { recursive: true });
      }

      const scriptPath = path.join(scriptDir, `${scriptName}.txt`);
      fs.writeFileSync(scriptPath, scriptContent);

      logger.info(`Script uploaded: ${scriptName}`);
      res.json({ success: true, message: 'Script uploaded', scriptName });
    } catch (error) {
      logger.error(`Error uploading script: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  listScripts: (req, res) => {
    try {
      const scriptDir = path.join(__dirname, '../../scripts');
      const scripts = fs.existsSync(scriptDir) ? fs.readdirSync(scriptDir) : [];
      res.json({ success: true, scripts, count: scripts.length });
    } catch (error) {
      logger.error(`Error listing scripts: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  runScript: async (req, res) => {
    try {
      const { scriptName, scriptContent } = req.body;
      
      let content = scriptContent;
      if (!content && scriptName) {
        const scriptPath = path.join(__dirname, '../../scripts', `${scriptName}.txt`);
        if (!fs.existsSync(scriptPath)) {
          return res.status(404).json({ error: 'Script not found' });
        }
        content = fs.readFileSync(scriptPath, 'utf8');
      }

      if (!content) {
        return res.status(400).json({ error: 'Script content is required' });
      }

      const success = await scriptEngine.runScript(content);
      res.json({ success, message: success ? 'Script executed' : 'Script failed' });
    } catch (error) {
      logger.error(`Error running script: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  stopScript: (req, res) => {
    try {
      scriptEngine.stopScript();
      res.json({ success: true, message: 'Script stopped' });
    } catch (error) {
      logger.error(`Error stopping script: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  // ============ ACCOUNT ENDPOINTS ============
  loadAccounts: (req, res) => {
    try {
      const { filePath } = req.body;
      if (!filePath) {
        return res.status(400).json({ error: 'filePath is required' });
      }

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      const accountManager = new AccountManager(filePath);
      const accounts = accountManager.listAccounts();

      res.json({ success: true, accounts, count: accounts.length });
    } catch (error) {
      logger.error(`Error loading accounts: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  listAccounts: (req, res) => {
    try {
      const accountFilePath = path.join(__dirname, '../../accounts/accounts.txt');
      const accountManager = new AccountManager(accountFilePath);
      const accounts = accountManager.listAccounts();

      res.json({ success: true, accounts, count: accounts.length });
    } catch (error) {
      logger.error(`Error listing accounts: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  authenticateAccounts: async (req, res) => {
    try {
      const { accounts } = req.body;
      if (!accounts || !Array.isArray(accounts)) {
        return res.status(400).json({ error: 'accounts array is required' });
      }

      const results = [];
      for (const account of accounts) {
        results.push({
          account,
          status: 'authenticated',
          timestamp: new Date()
        });
      }

      res.json({ success: true, results, count: results.length });
    } catch (error) {
      logger.error(`Error authenticating accounts: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  // ============ PROXY ENDPOINTS ============
  loadProxies: (req, res) => {
    try {
      const { filePath } = req.body;
      if (!filePath) {
        return res.status(400).json({ error: 'filePath is required' });
      }

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      proxyManager.loadProxies(filePath);
      const proxies = proxyManager.proxies;

      res.json({ success: true, proxies, count: proxies.length });
    } catch (error) {
      logger.error(`Error loading proxies: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  listProxies: (req, res) => {
    try {
      const proxies = proxyManager.proxies;
      res.json({ success: true, proxies, count: proxies.length });
    } catch (error) {
      logger.error(`Error listing proxies: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  checkProxyStatus: async (req, res) => {
    try {
      const { proxies } = req.body;
      const proxyList = proxies || proxyManager.proxies;

      if (proxyList.length === 0) {
        return res.json({ success: true, results: [], message: 'No proxies to check' });
      }

      const results = await proxyChecker.checkMultipleProxies(proxyList);
      res.json({ success: true, results, count: results.length });
    } catch (error) {
      logger.error(`Error checking proxies: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  // ============ GAME ENDPOINTS ============
  getGameState: (req, res) => {
    try {
      const state = gameState.getState();
      res.json({ success: true, ...state });
    } catch (error) {
      logger.error(`Error getting game state: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  performGameAction: (req, res) => {
    try {
      const { action, payload } = req.body;
      if (!action) {
        return res.status(400).json({ error: 'action is required' });
      }

      logger.info(`Game action: ${action}`);
      
      // Handle different actions
      switch (action) {
        case 'spawn_vehicle':
          if (payload && payload.type && payload.position) {
            const vehicleId = `vehicle_${Date.now()}`;
            const Vehicle = require('../simulation/vehicle');
            const vehicle = new Vehicle(vehicleId, payload.type, payload.position);
            gameState.addVehicle(vehicleId, vehicle);
            res.json({ success: true, message: 'Vehicle spawned', vehicleId });
          } else {
            res.status(400).json({ error: 'type and position are required' });
          }
          break;

        case 'place_traffic_light':
          if (payload && payload.position) {
            const lightId = `light_${Date.now()}`;
            gameState.trafficLights.set(lightId, {
              id: lightId,
              position: payload.position,
              state: 'red'
            });
            res.json({ success: true, message: 'Traffic light placed', lightId });
          } else {
            res.status(400).json({ error: 'position is required' });
          }
          break;

        default:
          res.json({ success: true, message: 'Action processed' });
      }
    } catch (error) {
      logger.error(`Error performing game action: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  saveProgress: (req, res) => {
    try {
      gameState.saveGameData();
      res.json({ success: true, message: 'Game state saved', timestamp: new Date() });
    } catch (error) {
      logger.error(`Error saving game progress: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  getLeaderboard: (req, res) => {
    try {
      const leaderboard = Object.entries(gameState.scores)
        .map(([player, score]) => ({ player, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);

      res.json({ success: true, leaderboard, count: leaderboard.length });
    } catch (error) {
      logger.error(`Error getting leaderboard: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  // ============ MULTIPLAYER ENDPOINTS ============
  joinMultiplayer: (req, res) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ error: 'username is required' });
      }

      res.json({ success: true, message: 'Joined multiplayer', username });
    } catch (error) {
      logger.error(`Error joining multiplayer: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  // ============ WEBHOOK ENDPOINTS ============
  configureWebhook: (req, res) => {
    try {
      const { url, events } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'url is required' });
      }

      webhookManager.addWebhook(url, events || []);
      res.json({ success: true, message: 'Webhook configured', url });
    } catch (error) {
      logger.error(`Error configuring webhook: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  // ============ THEME ENDPOINTS ============
  loadTheme: (req, res) => {
    try {
      const { themePath } = req.body;
      if (!themePath) {
        return res.status(400).json({ error: 'themePath is required' });
      }

      if (!fs.existsSync(themePath)) {
        return res.status(404).json({ error: 'Theme file not found' });
      }

      const css = fs.readFileSync(themePath, 'utf8');
      res.json({ success: true, css });
    } catch (error) {
      logger.error(`Error loading theme: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  getCurrentTheme: (req, res) => {
    try {
      res.json({ success: true, theme: 'default' });
    } catch (error) {
      logger.error(`Error getting current theme: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  // ============ UTILITY ENDPOINTS ============
  generateUsername: (req, res) => {
    try {
      const { salt, legit } = req.body;
      const username = generateRandomUsername(salt === true, legit === true);
      res.json({ success: true, username });
    } catch (error) {
      logger.error(`Error generating username: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  getServerStatus: (req, res) => {
    try {
      res.json({
        success: true,
        status: 'online',
        timestamp: new Date(),
        version: '1.0.0',
        vehicleCount: gameState.vehicles.size,
        playerCount: 0
      });
    } catch (error) {
      logger.error(`Error getting server status: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = handlers;
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const gameState = require('../game/gameState');
const scriptEngine = require('../scripting/scriptEngine');
const accountManager = require('../accounts/accountManager');
const proxyManager = require('../proxies/proxyManager');

const handlers = {
  uploadScript: (req, res) => {
    const { scriptName, scriptContent } = req.body;
    const scriptDir = path.join(__dirname, '../../scripts');

    if (!fs.existsSync(scriptDir)) {
      fs.mkdirSync(scriptDir, { recursive: true });
    }

    const scriptPath = path.join(scriptDir, `${scriptName}.txt`);
    fs.writeFileSync(scriptPath, scriptContent);

    logger.info(`Script uploaded: ${scriptName}`);
    res.json({ success: true, message: 'Script uploaded', scriptName });
  },

  listScripts: (req, res) => {
    const scriptDir = path.join(__dirname, '../../scripts');
    const scripts = fs.existsSync(scriptDir) ? fs.readdirSync(scriptDir) : [];
    res.json({ scripts });
  },

  runScript: async (req, res) => {
    const { scriptName } = req.body;
    const scriptPath = path.join(__dirname, '../../scripts', `${scriptName}.txt`);

    if (!fs.existsSync(scriptPath)) {
      return res.status(404).json({ error: 'Script not found' });
    }

    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    const success = await scriptEngine.runScript(scriptContent);

    res.json({ success, message: success ? 'Script executed' : 'Script failed' });
  },

  loadAccounts: (req, res) => {
    const { filePath } = req.body;
    const accounts = accountManager.loadAccountsFromFile(filePath);
    res.json({ success: true, accountsCount: accounts.length });
  },

  listAccounts: (req, res) => {
    const accounts = accountManager.getAccountsList();
    res.json({ accounts, count: accounts.length });
  },

  loadProxies: (req, res) => {
    const { filePath } = req.body;
    const proxies = proxyManager.loadProxiesFromFile(filePath);
    res.json({ success: true, proxiesCount: proxies.length });
  },

  listProxies: (req, res) => {
    const proxies = proxyManager.getProxysList();
    res.json({ proxies, count: proxies.length });
  },

  checkProxies: async (req, res) => {
    const proxies = proxyManager.getProxysList();
    res.json({ results: proxies.map(p => ({ proxy: p, status: 'checked' })) });
  },

  getGameState: (req, res) => {
    res.json(gameState.getState());
  },

  gameAction: (req, res) => {
    const { action, payload } = req.body;
    logger.info(`Game action: ${action}`);
    res.json({ success: true, message: 'Action processed' });
  },

  saveGame: (req, res) => {
    gameState.saveGameData();
    res.json({ success: true, message: 'Game saved' });
  },

  loadTheme: (req, res) => {
    const { themePath } = req.body;
    if (!fs.existsSync(themePath)) {
      return res.status(404).json({ error: 'Theme file not found' });
    }
    const css = fs.readFileSync(themePath, 'utf8');
    res.json({ success: true, css });
  },

  getCurrentTheme: (req, res) => {
    res.json({ theme: 'default' });
  }
};

module.exports = handlers;
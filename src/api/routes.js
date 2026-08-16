const express = require('express');
const router = express.Router();
const handlers = require('./handlers');

// ============ SCRIPT MANAGEMENT ============
router.post('/script/upload', handlers.uploadScript);
router.get('/script/list', handlers.listScripts);
router.post('/script/run', handlers.runScript);
router.post('/script/stop', handlers.stopScript);

// ============ ACCOUNT MANAGEMENT ============
router.post('/accounts/load', handlers.loadAccounts);
router.get('/accounts/list', handlers.listAccounts);
router.post('/accounts/auth', handlers.authenticateAccounts);
router.post('/accounts/generate-username', handlers.generateUsername);

// ============ PROXY MANAGEMENT ============
router.post('/proxies/load', handlers.loadProxies);
router.get('/proxies/list', handlers.listProxies);
router.post('/proxies/check', handlers.checkProxyStatus);

// ============ GAME MANAGEMENT ============
router.get('/game/state', handlers.getGameState);
router.post('/game/action', handlers.performGameAction);
router.post('/game/save', handlers.saveProgress);
router.get('/game/leaderboard', handlers.getLeaderboard);

// ============ MULTIPLAYER ============
router.post('/multiplayer/join', handlers.joinMultiplayer);

// ============ WEBHOOK ============
router.post('/webhook/configure', handlers.configureWebhook);

// ============ THEME ============
router.post('/theme/load', handlers.loadTheme);
router.get('/theme/current', handlers.getCurrentTheme);

// ============ SERVER ============
router.get('/status', handlers.getServerStatus);

// Legacy routes for compatibility
router.post('/save', handlers.saveProgress);
router.get('/leaderboard', handlers.getLeaderboard);

module.exports = router;
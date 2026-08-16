const express = require('express');
const router = express.Router();
const handlers = require('./handlers');

// Script Management Routes
router.post('/script/upload', handlers.uploadScript);
router.get('/script/list', handlers.listScripts);
router.post('/script/run', handlers.runScript);
router.post('/script/stop', handlers.stopScript);

// Account Management Routes
router.post('/accounts/load', handlers.loadAccounts);
router.get('/accounts/list', handlers.listAccounts);
router.post('/accounts/auth', handlers.authenticateAccounts);

// Proxy Management Routes
router.post('/proxies/load', handlers.loadProxies);
router.get('/proxies/list', handlers.listProxies);
router.post('/proxies/check', handlers.checkProxyStatus);

// Game Management Routes
router.get('/game/state', handlers.getGameState);
router.post('/game/action', handlers.performGameAction);
router.post('/save', handlers.saveProgress);
router.get('/leaderboard', handlers.getLeaderboard);
router.post('/multiplayer/join', handlers.joinMultiplayer);
router.post('/webhook/configure', handlers.configureWebhook);

// Export the router
module.exports = router;
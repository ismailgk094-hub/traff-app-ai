const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class AutoSave {
    constructor(saveInterval = 60000) {
        this.saveInterval = saveInterval;
        this.savePath = path.join(__dirname, '../../data/saves');
        this.isSaving = false;
        this.intervalId = null;
        this.saveCount = 0;
        this.lastSaveTime = null;

        // Ensure save directory exists
        if (!fs.existsSync(this.savePath)) {
            fs.mkdirSync(this.savePath, { recursive: true });
        }
    }

    startAutoSave(gameState) {
        if (this.isSaving && this.intervalId) {
            return; // Already running
        }

        this.isSaving = true;
        logger.info(`Auto-save started with interval: ${this.saveInterval}ms`);

        // Initial save
        this.saveGameState(gameState);

        // Set up interval
        this.intervalId = setInterval(() => {
            this.saveGameState(gameState);
        }, this.saveInterval);
    }

    stopAutoSave() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isSaving = false;
        logger.info('Auto-save stopped');
    }

    saveGameState(gameState) {
        try {
            if (!gameState) {
                logger.warn('No game state to save');
                return;
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const saveFile = path.join(this.savePath, `autosave-${timestamp}.json`);
            const latestFile = path.join(this.savePath, 'latest.json');

            // Prepare data for saving
            const dataToSave = typeof gameState === 'object' && gameState.getState 
                ? gameState.getState() 
                : gameState;

            // Write to timestamped file
            fs.writeFileSync(saveFile, JSON.stringify(dataToSave, null, 2));

            // Write to latest file
            fs.writeFileSync(latestFile, JSON.stringify(dataToSave, null, 2));

            this.saveCount++;
            this.lastSaveTime = new Date();

            logger.info(`Game state auto-saved successfully (${this.saveCount} saves)`);

            // Clean up old saves (keep last 10)
            this.cleanupOldSaves();
        } catch (error) {
            logger.error(`Error saving game state: ${error.message}`);
        }
    }

    cleanupOldSaves() {
        try {
            const files = fs.readdirSync(this.savePath)
                .filter(f => f.startsWith('autosave-') && f.endsWith('.json'))
                .sort()
                .reverse();

            // Keep only the last 10 saves
            if (files.length > 10) {
                for (let i = 10; i < files.length; i++) {
                    const filePath = path.join(this.savePath, files[i]);
                    fs.unlinkSync(filePath);
                    logger.debug(`Deleted old save: ${files[i]}`);
                }
            }
        } catch (error) {
            logger.warn(`Error cleaning up old saves: ${error.message}`);
        }
    }

    loadLatestSave() {
        try {
            const latestFile = path.join(this.savePath, 'latest.json');
            if (fs.existsSync(latestFile)) {
                const data = fs.readFileSync(latestFile, 'utf8');
                logger.info('Latest save loaded');
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            logger.error(`Error loading latest save: ${error.message}`);
            return null;
        }
    }

    getSaveStats() {
        try {
            const files = fs.readdirSync(this.savePath)
                .filter(f => f.startsWith('autosave-') && f.endsWith('.json'));

            return {
                saveCount: this.saveCount,
                totalSaves: files.length,
                lastSaveTime: this.lastSaveTime,
                savePath: this.savePath,
                isActive: this.isSaving
            };
        } catch (error) {
            logger.error(`Error getting save stats: ${error.message}`);
            return null;
        }
    }
}

module.exports = new AutoSave();
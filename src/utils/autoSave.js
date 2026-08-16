const fs = require('fs');
const path = require('path');

// Auto-save functionality for game progress
class AutoSave {
    constructor(saveInterval = 60000) { // Default save interval set to 60 seconds
        this.saveInterval = saveInterval;
        this.savePath = path.join(__dirname, '../../data/saves');
        this.isSaving = false;
    }

    startAutoSave(gameState) {
        if (this.isSaving) return; // Prevent multiple intervals
        this.isSaving = true;

        this.saveGameState(gameState); // Initial save
        this.intervalId = setInterval(() => {
            this.saveGameState(gameState);
        }, this.saveInterval);
    }

    stopAutoSave() {
        clearInterval(this.intervalId);
        this.isSaving = false;
    }

    saveGameState(gameState) {
        const saveFile = path.join(this.savePath, 'autosave.json');
        fs.writeFile(saveFile, JSON.stringify(gameState), (err) => {
            if (err) {
                console.error('Error saving game state:', err);
            } else {
                console.log('Game state auto-saved successfully.');
            }
        });
    }
}

module.exports = AutoSave;
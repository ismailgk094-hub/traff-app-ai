const logger = require('../utils/logger');

class LevelManager {
    constructor() {
        this.levels = this.initializeLevels();
        this.currentLevelIndex = 0;
        this.completedLevels = new Set();
        this.levelProgress = new Map();
    }

    initializeLevels() {
        return [
            {
                id: 1,
                name: 'Tutorial - Basic Controls',
                difficulty: 'easy',
                objectives: ['Place 3 traffic lights', 'Let 10 vehicles pass'],
                timeLimit: 300,
                vehicleCount: 5,
                reward: 100
            },
            {
                id: 2,
                name: 'Morning Rush',
                difficulty: 'easy',
                objectives: ['Manage 15 vehicles', 'Avoid 2 accidents'],
                timeLimit: 240,
                vehicleCount: 15,
                reward: 250
            }
        ];
    }

    loadLevels(levelData) {
        this.levels = levelData;
        logger.info(`Loaded ${levelData.length} levels`);
    }

    getCurrentLevel() {
        return this.levels[this.currentLevelIndex];
    }

    getLevelById(levelId) {
        return this.levels.find(l => l.id === levelId);
    }

    advanceToNextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            const currentLevel = this.getCurrentLevel();
            this.completedLevels.add(currentLevel.id);
            this.currentLevelIndex++;
            logger.info(`Advanced to level ${this.getCurrentLevel().id}`);
            return true;
        }
        return false;
    }

    resetLevel() {
        this.currentLevelIndex = 0;
        this.completedLevels.clear();
        this.levelProgress.clear();
        logger.info('Level progress reset');
    }

    getLevelChallenges() {
        const currentLevel = this.getCurrentLevel();
        return currentLevel ? currentLevel.objectives : [];
    }

    isLastLevel() {
        return this.currentLevelIndex === this.levels.length - 1;
    }

    getProgress() {
        return {
            currentLevel: this.currentLevelIndex + 1,
            totalLevels: this.levels.length,
            completedLevels: this.completedLevels.size,
            progressPercentage: Math.round((this.completedLevels.size / this.levels.length) * 100)
        };
    }

    getAllLevels() {
        return this.levels.map((level, index) => ({
            ...level,
            completed: this.completedLevels.has(level.id),
            index
        }));
    }
}

module.exports = new LevelManager();
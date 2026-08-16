class LevelManager {
    constructor() {
        this.levels = [];
        this.currentLevelIndex = 0;
    }

    loadLevels(levelData) {
        this.levels = levelData;
    }

    getCurrentLevel() {
        return this.levels[this.currentLevelIndex];
    }

    advanceToNextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
        }
    }

    resetLevel() {
        this.currentLevelIndex = 0;
    }

    getLevelChallenges() {
        const currentLevel = this.getCurrentLevel();
        return currentLevel ? currentLevel.challenges : [];
    }

    isLastLevel() {
        return this.currentLevelIndex === this.levels.length - 1;
    }
}
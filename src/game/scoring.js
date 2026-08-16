const logger = require('../utils/logger');

class ScoringSystem {
    constructor() {
        this.score = 0;
        this.totalScore = 0;
        this.efficiency = 0;
        this.accidents = 0;
        this.violations = 0;
        this.pollution = 0;
        this.emergencyResponseTime = 0;
        this.averageWaitTime = 0;
        this.playerScores = new Map();
        this.sessionStartTime = new Date();
    }

    calculateScore() {
        const efficiencyBonus = Math.floor(this.efficiency * 10);
        const accidentPenalty = this.accidents * 50;
        const violationPenalty = this.violations * 20;
        const pollutionPenalty = Math.floor(this.pollution * 0.5);
        const waitTimePenalty = Math.floor(this.averageWaitTime * 0.1);
        
        this.score = Math.max(0, efficiencyBonus - accidentPenalty - violationPenalty - pollutionPenalty - waitTimePenalty);
        this.totalScore += this.score;
        
        return this.score;
    }

    recordPlayerScore(playerId, score) {
        if (!this.playerScores.has(playerId)) {
            this.playerScores.set(playerId, []);
        }
        
        this.playerScores.get(playerId).push({
            score,
            timestamp: new Date()
        });
        
        logger.info(`Player ${playerId} scored ${score}`);
    }

    updateEfficiency(value) {
        this.efficiency = Math.min(100, Math.max(0, this.efficiency + value));
    }

    recordAccident() {
        this.accidents += 1;
        logger.warn(`Accident recorded! Total: ${this.accidents}`);
    }

    recordViolation() {
        this.violations += 1;
        logger.warn(`Violation recorded! Total: ${this.violations}`);
    }

    recordPollution(value) {
        this.pollution += value;
    }

    getLeaderboard() {
        const leaderboard = [];
        
        for (const [playerId, scores] of this.playerScores.entries()) {
            const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
            const averageScore = Math.round(totalScore / scores.length);
            
            leaderboard.push({
                playerId,
                totalScore,
                averageScore,
                gamesPlayed: scores.length
            });
        }
        
        return leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    }

    getCurrentSessionStats() {
        return {
            sessionDuration: new Date() - this.sessionStartTime,
            currentScore: this.score,
            totalScore: this.totalScore,
            efficiency: this.efficiency,
            accidents: this.accidents,
            violations: this.violations,
            pollution: this.pollution
        };
    }

    reset() {
        this.score = 0;
        this.efficiency = 0;
        this.accidents = 0;
        this.violations = 0;
        this.pollution = 0;
        this.emergencyResponseTime = 0;
        this.averageWaitTime = 0;
        this.sessionStartTime = new Date();
        logger.info('Scoring system reset');
    }
}

module.exports = new ScoringSystem();
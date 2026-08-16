class ScoringSystem {
    constructor() {
        this.score = 0;
        this.efficiency = 0;
        this.accidents = 0;
        this.violations = 0;
        this.pollution = 0;
    }

    calculateScore() {
        // Calculate score based on various factors
        this.score = this.efficiency * 10 - (this.accidents * 5 + this.violations * 2 + this.pollution);
        return this.score;
    }

    updateEfficiency(value) {
        this.efficiency += value;
    }

    recordAccident() {
        this.accidents += 1;
    }

    recordViolation() {
        this.violations += 1;
    }

    recordPollution(value) {
        this.pollution += value;
    }

    reset() {
        this.score = 0;
        this.efficiency = 0;
        this.accidents = 0;
        this.violations = 0;
        this.pollution = 0;
    }
}

module.exports = ScoringSystem;
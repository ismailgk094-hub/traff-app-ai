const adjectives = [
    "Swift", "Clever", "Brave", "Mighty", "Nimble", "Bold", "Quick", "Eager", "Vigorous", "Daring"
];

const nouns = [
    "Driver", "Racer", "Navigator", "Pilot", "Explorer", "Chaser", "Guardian", "Scout", "Adventurer", "Hero"
];

function generateRandomUsername(salt = false, legit = false) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    let username = `${adjective}${noun}`;

    if (salt) {
        const randomSuffix = Math.floor(Math.random() * 1000);
        username += randomSuffix;
    }

    if (legit) {
        username += "_LEGIT";
    }

    return username;
}

module.exports = {
    generateRandomUsername
};
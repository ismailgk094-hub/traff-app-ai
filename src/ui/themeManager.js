const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themes = new Map();
        this.themePath = path.join(__dirname, '../../public/themes');
        this.loadDefaultTheme();
    }

    loadDefaultTheme() {
        // Initialize default theme
        this.themes.set('default', {
            name: 'default',
            path: path.join(this.themePath, 'default.css'),
            css: this.getDefaultCSS()
        });
        logger.info('Default theme loaded');
    }

    getDefaultCSS() {
        return `
/* Default NodeFlow Theme */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #1a1a1a;
    color: #ffffff;
    overflow: hidden;
}

#gameContainer {
    width: 100vw;
    height: 100vh;
    display: flex;
}

#canvas {
    flex: 1;
    background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
}

#sidebar {
    width: 300px;
    background: #0f0f0f;
    border-left: 1px solid #444;
    overflow-y: auto;
    padding: 20px;
}

.sidebar-section {
    margin-bottom: 20px;
    border-bottom: 1px solid #333;
    padding-bottom: 15px;
}

.sidebar-section h3 {
    color: #00ff00;
    margin-bottom: 10px;
    font-size: 14px;
}

.vehicle-list {
    max-height: 200px;
    overflow-y: auto;
}

.vehicle-item {
    padding: 8px;
    margin: 5px 0;
    background: #1a1a1a;
    border-left: 3px solid #00ff00;
    font-size: 12px;
}

button {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    background: #00ff00;
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

button:hover {
    background: #00dd00;
}

button:active {
    transform: scale(0.95);
}

#chatLog {
    background: #000;
    border: 1px solid #333;
    padding: 10px;
    height: 150px;
    overflow-y: auto;
    font-size: 12px;
    margin-bottom: 10px;
    border-radius: 4px;
}

.chat-message {
    margin: 5px 0;
    color: #00ff00;
}

#statPanel {
    font-size: 12px;
    line-height: 1.8;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    margin: 3px 0;
}

.stat-label {
    color: #888;
}

.stat-value {
    color: #00ff00;
    font-weight: bold;
}

#statusBar {
    background: #222;
    padding: 10px;
    border-top: 1px solid #444;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
}

.status-item {
    color: #00ff00;
}
        `;
    }

    loadTheme(themeName) {
        const themePath = path.join(this.themePath, `${themeName}.css`);
        
        if (fs.existsSync(themePath)) {
            const css = fs.readFileSync(themePath, 'utf8');
            this.themes.set(themeName, {
                name: themeName,
                path: themePath,
                css: css
            });
            this.currentTheme = themeName;
            logger.info(`Theme loaded: ${themeName}`);
            return true;
        } else {
            logger.warn(`Theme file not found: ${themePath}`);
            return false;
        }
    }

    switchTheme(themeName) {
        if (this.themes.has(themeName)) {
            this.currentTheme = themeName;
            logger.info(`Theme switched to: ${themeName}`);
            return true;
        } else {
            logger.warn(`Theme not found: ${themeName}`);
            return false;
        }
    }

    getCurrentTheme() {
        return this.themes.get(this.currentTheme);
    }

    getCurrentThemeCSS() {
        const theme = this.getCurrentTheme();
        return theme ? theme.css : this.getDefaultCSS();
    }

    getThemeList() {
        return Array.from(this.themes.values()).map(t => ({
            name: t.name,
            path: t.path
        }));
    }

    addCustomTheme(themeName, cssContent) {
        this.themes.set(themeName, {
            name: themeName,
            css: cssContent,
            custom: true
        });
        logger.info(`Custom theme added: ${themeName}`);
    }
}

module.exports = new ThemeManager();
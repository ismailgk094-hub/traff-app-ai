const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class CSSLoader {
    constructor() {
        this.stylesheets = new Map();
    }

    loadCSS(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                const cssContent = fs.readFileSync(filePath, 'utf-8');
                const fileName = path.basename(filePath);
                this.stylesheets.set(fileName, {
                    path: filePath,
                    content: cssContent
                });
                logger.info(`CSS loaded: ${filePath}`);
                return { success: true, content: cssContent };
            } else {
                logger.error(`CSS file not found: ${filePath}`);
                return { success: false, error: `File not found: ${filePath}` };
            }
        } catch (error) {
            logger.error(`Error loading CSS: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    loadCSSFromString(name, cssContent) {
        this.stylesheets.set(name, {
            content: cssContent,
            fromString: true
        });
        logger.info(`CSS loaded from string: ${name}`);
        return { success: true };
    }

    getCSS(name) {
        const stylesheet = this.stylesheets.get(name);
        return stylesheet ? stylesheet.content : null;
    }

    getAllCSS() {
        const result = {};
        for (const [name, stylesheet] of this.stylesheets.entries()) {
            result[name] = stylesheet.content;
        }
        return result;
    }

    getStylesheets() {
        return Array.from(this.stylesheets.values()).map((s, index) => ({
            id: index,
            path: s.path,
            fromString: s.fromString || false
        }));
    }

    combineCSS() {
        let combined = '';
        for (const [, stylesheet] of this.stylesheets.entries()) {
            combined += stylesheet.content + '\n';
        }
        return combined;
    }
}

module.exports = new CSSLoader();
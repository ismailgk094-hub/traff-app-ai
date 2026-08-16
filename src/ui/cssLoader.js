const fs = require('fs');

class CSSLoader {
    constructor() {
        this.stylesheets = [];
    }

    loadCSS(filePath) {
        if (fs.existsSync(filePath)) {
            const cssContent = fs.readFileSync(filePath, 'utf-8');
            this.stylesheets.push({ path: filePath, content: cssContent });
            this.applyCSS(cssContent);
        } else {
            console.error(`CSS file not found: ${filePath}`);
        }
    }

    applyCSS(cssContent) {
        // Logic to apply CSS to the UI
        // This could involve injecting styles into a <style> tag in the HTML
        const styleTag = document.createElement('style');
        styleTag.innerHTML = cssContent;
        document.head.appendChild(styleTag);
    }

    getStylesheets() {
        return this.stylesheets;
    }
}

module.exports = CSSLoader;
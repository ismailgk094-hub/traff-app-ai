class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themes = {};
    }

    loadTheme(themeName) {
        const themePath = `./public/themes/${themeName}.css`;
        this.themes[themeName] = themePath;
        this.applyTheme(themePath);
    }

    applyTheme(themePath) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = themePath;
        document.head.appendChild(linkElement);
        this.currentTheme = themePath;
    }

    switchTheme(themeName) {
        if (this.themes[themeName]) {
            this.applyTheme(this.themes[themeName]);
        } else {
            console.warn(`Theme ${themeName} not found.`);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

export default new ThemeManager();
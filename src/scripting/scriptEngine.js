const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const config = require('../utils/config');
const ScriptCommand = require('./scriptCommands');

class ScriptEngine {
    constructor() {
        this.commands = {};
        this.variables = {};
        this.currentScript = null;
        this.isRunning = false;
        this.executionStack = [];
        this.registerCommands();
    }

    registerCommands() {
        this.commands = {
            'chat': ScriptCommand.chat,
            'useHeld': ScriptCommand.useHeld,
            'setHotbar': ScriptCommand.setHotbar,
            'winClick': ScriptCommand.winClick,
            'closeWindow': ScriptCommand.closeWindow,
            'drop': ScriptCommand.drop,
            'startMove': ScriptCommand.startMove,
            'stopMove': ScriptCommand.stopMove,
            'afkOn': ScriptCommand.afkOn,
            'afkOff': ScriptCommand.afkOff,
            'disconnect': ScriptCommand.disconnect,
            'reconnect': ScriptCommand.reconnect,
            'delay': ScriptCommand.delay,
            'loop': ScriptCommand.loop
        };
    }

    async parseAndExecute(scriptText) {
        try {
            this.isRunning = true;
            const lines = scriptText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
            
            for (let i = 0; i < lines.length; i++) {
                if (!this.isRunning) break;
                await this.executeLine(lines[i]);
            }
            
            this.isRunning = false;
            logger.info('Script execution completed');
            return true;
        } catch (error) {
            logger.error(`Script execution error: ${error.message}`);
            this.isRunning = false;
            return false;
        }
    }

    async executeLine(line) {
        if (!line || line.startsWith('//')) return;

        const parts = this.tokenizeLine(line);
        if (parts.length === 0) return;

        const command = parts[0];
        const args = parts.slice(1);

        if (command === 'loop') {
            return this.executeLoop(args, line);
        }

        if (this.commands[command]) {
            const substitutedArgs = args.map(arg => this.substituteVariables(arg));
            return await this.commands[command](...substitutedArgs);
        } else {
            logger.warn(`Unknown command: ${command}`);
        }
    }

    tokenizeLine(line) {
        const tokens = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ' ' && !inQuotes) {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }
        
        if (current) tokens.push(current);
        return tokens;
    }

    substituteVariables(text) {
        let result = text;
        
        // Replace {variable} with actual values
        result = result.replace(/{player}/g, this.variables.player || 'default');
        result = result.replace(/{random}/g, Math.random().toString(36).substr(2, 9));
        
        return result;
    }

    async executeLoop(args, line) {
        // Extract loop count and body
        const loopMatch = line.match(/loop\s+(\d+)\s*{([\s\S]*?)}/);
        if (!loopMatch) {
            logger.warn('Invalid loop syntax');
            return;
        }

        const times = parseInt(loopMatch[1]);
        const body = loopMatch[2];
        const bodyLines = body.split(';').map(l => l.trim()).filter(l => l);

        for (let i = 0; i < times; i++) {
            if (!this.isRunning) break;
            for (const bodyLine of bodyLines) {
                await this.executeLine(bodyLine);
            }
        }
    }

    async runScript(scriptContent) {
        return this.parseAndExecute(scriptContent);
    }

    async runScriptFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return this.parseAndExecute(content);
        } catch (error) {
            logger.error(`Error reading script file: ${error.message}`);
            return false;
        }
    }

    stopScript() {
        this.isRunning = false;
        logger.info('Script execution stopped');
    }

    setVariable(name, value) {
        this.variables[name] = value;
    }

    getVariable(name) {
        return this.variables[name];
    }
}

module.exports = new ScriptEngine();
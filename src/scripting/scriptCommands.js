const logger = require('../utils/logger');

class ScriptCommand {
    static scriptLog = [];
    static gameState = null;
    static socketIO = null;

    static setGameState(gameState, io) {
        this.gameState = gameState;
        this.socketIO = io;
    }

    static chat(message) {
        const cleanMessage = message.replace(/"/g, '').trim();
        this.scriptLog.push({ type: 'chat', message: cleanMessage, timestamp: new Date() });
        logger.info(`[SCRIPT CHAT]: ${cleanMessage}`);
        
        if (this.socketIO) {
            this.socketIO.emit('script:log', {
                type: 'chat',
                message: cleanMessage,
                timestamp: new Date()
            });
        }
    }

    static async useHeld() {
        logger.info('[SCRIPT]: useHeld command executed');
        // Simulate tool use
        if (this.socketIO) {
            this.socketIO.emit('script:action', {
                action: 'useHeld',
                timestamp: new Date()
            });
        }
    }

    static setHotbar(slot) {
        const slotNum = parseInt(slot);
        if (slotNum >= 0 && slotNum <= 8) {
            logger.info(`[SCRIPT]: Hotbar slot switched to ${slotNum}`);
            if (this.socketIO) {
                this.socketIO.emit('script:action', {
                    action: 'setHotbar',
                    slot: slotNum,
                    timestamp: new Date()
                });
            }
        } else {
            logger.warn(`Invalid hotbar slot: ${slot}`);
        }
    }

    static winClick(slot, type) {
        const slotNum = parseInt(slot);
        const clickType = parseInt(type) === 1 ? 'right' : 'left';
        logger.info(`[SCRIPT]: Window click on slot ${slotNum} (${clickType} click)`);
        
        if (this.socketIO) {
            this.socketIO.emit('script:action', {
                action: 'winClick',
                slot: slotNum,
                type: clickType,
                timestamp: new Date()
            });
        }
    }

    static closeWindow() {
        logger.info('[SCRIPT]: Window closed');
        if (this.socketIO) {
            this.socketIO.emit('script:action', {
                action: 'closeWindow',
                timestamp: new Date()
            });
        }
    }

    static drop(slot) {
        const slotNum = parseInt(slot);
        logger.info(`[SCRIPT]: Item dropped from slot ${slotNum}`);
        if (this.socketIO) {
            this.socketIO.emit('script:action', {
                action: 'drop',
                slot: slotNum,
                timestamp: new Date()
            });
        }
    }

    static startMove(direction) {
        const validDirections = ['forward', 'backward', 'left', 'right'];
        if (validDirections.includes(direction)) {
            logger.info(`[SCRIPT]: Started moving ${direction}`);
            if (this.socketIO) {
                this.socketIO.emit('script:action', {
                    action: 'startMove',
                    direction,
                    timestamp: new Date()
                });
            }
        } else {
            logger.warn(`Invalid direction: ${direction}`);
        }
    }

    static stopMove(direction) {
        const validDirections = ['forward', 'backward', 'left', 'right'];
        if (validDirections.includes(direction)) {
            logger.info(`[SCRIPT]: Stopped moving ${direction}`);
            if (this.socketIO) {
                this.socketIO.emit('script:action', {
                    action: 'stopMove',
                    direction,
                    timestamp: new Date()
                });
            }
        } else {
            logger.warn(`Invalid direction: ${direction}`);
        }
    }

    static afkOn() {
        logger.info('[SCRIPT]: Anti-AFK enabled');
        if (this.socketIO) {
            this.socketIO.emit('afk:toggle', { enabled: true });
        }
    }

    static afkOff() {
        logger.info('[SCRIPT]: Anti-AFK disabled');
        if (this.socketIO) {
            this.socketIO.emit('afk:toggle', { enabled: false });
        }
    }

    static disconnect() {
        logger.info('[SCRIPT]: Disconnect command executed');
        if (this.socketIO) {
            this.socketIO.emit('script:action', {
                action: 'disconnect',
                timestamp: new Date()
            });
        }
    }

    static reconnect() {
        logger.info('[SCRIPT]: Reconnect command executed');
        if (this.socketIO) {
            this.socketIO.emit('script:action', {
                action: 'reconnect',
                timestamp: new Date()
            });
        }
    }

    static async delay(ms) {
        const delayMs = parseInt(ms) || 1000;
        logger.debug(`[SCRIPT]: Delay for ${delayMs}ms`);
        return new Promise(resolve => setTimeout(resolve, delayMs));
    }

    static async loop(times, ...body) {
        // Loop is handled in the engine
        logger.info(`[SCRIPT]: Loop command (${times} iterations)`);
    }

    static getScriptLog() {
        return this.scriptLog;
    }

    static clearScriptLog() {
        this.scriptLog = [];
    }
}

module.exports = ScriptCommand;
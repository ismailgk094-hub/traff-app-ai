class ScriptValidator {
    constructor() {
        this.validCommands = [
            'chat',
            'useHeld',
            'setHotbar',
            'winClick',
            'closeWindow',
            'drop',
            'startMove',
            'stopMove',
            'afkOn',
            'afkOff',
            'disconnect',
            'reconnect',
            'delay',
            'loop'
        ];
    }

    validate(scriptText) {
        const lines = scriptText.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (line.length === 0) continue; // Skip empty lines
            if (!this.isValidCommand(line)) {
                return `Invalid command: "${line}"`;
            }
        }
        return 'Script is valid';
    }

    isValidCommand(line) {
        const command = line.split(' ')[0];
        return this.validCommands.includes(command);
    }
}
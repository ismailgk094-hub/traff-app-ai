const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'nodeflow.log');

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] INFO: ${message}`;
    console.log(log);
    fs.appendFileSync(logFile, log + '\n');
  },

  error: (message) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ERROR: ${message}`;
    console.error(log);
    fs.appendFileSync(logFile, log + '\n');
  },

  warn: (message) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] WARN: ${message}`;
    console.warn(log);
    fs.appendFileSync(logFile, log + '\n');
  },

  debug: (message) => {
    if (process.env.DEBUG) {
      const timestamp = new Date().toISOString();
      const log = `[${timestamp}] DEBUG: ${message}`;
      console.log(log);
      fs.appendFileSync(logFile, log + '\n');
    }
  }
};

module.exports = logger;
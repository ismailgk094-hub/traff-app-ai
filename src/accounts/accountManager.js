const fs = require('fs');
const path = require('path');

class AccountManager {
    constructor(accountFilePath) {
        this.accountFilePath = accountFilePath;
        this.accounts = [];
        this.loadAccounts();
    }

    loadAccounts() {
        if (fs.existsSync(this.accountFilePath)) {
            const data = fs.readFileSync(this.accountFilePath, 'utf-8');
            this.accounts = data.split('\n').filter(account => account.trim() !== '');
        } else {
            console.error('Account file not found.');
        }
    }

    saveAccounts() {
        fs.writeFileSync(this.accountFilePath, this.accounts.join('\n'), 'utf-8');
    }

    addAccount(username) {
        if (!this.accounts.includes(username)) {
            this.accounts.push(username);
            this.saveAccounts();
        } else {
            console.log('Account already exists.');
        }
    }

    removeAccount(username) {
        this.accounts = this.accounts.filter(account => account !== username);
        this.saveAccounts();
    }

    listAccounts() {
        return this.accounts;
    }
}

module.exports = AccountManager;
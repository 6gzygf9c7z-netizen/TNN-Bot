const fs = require("fs");

const path = "./data/accounts.json";

function loadAccounts() {

    if (!fs.existsSync(path)) {

        fs.writeFileSync(
            path,
            JSON.stringify({}, null, 4)
        );

    }

    return JSON.parse(
        fs.readFileSync(path, "utf8")
    );

}

function saveAccounts(accounts) {

    fs.writeFileSync(
        path,
        JSON.stringify(accounts, null, 4)
    );

}

function createAccount(userId, guildId) {

    const accounts = loadAccounts();

    if (accounts[userId]) {

        return accounts[userId];

    }

    accounts[userId] = {

        id: userId,

        guildId: guildId,

        wallet: 0,

        bank: 0,

        debt: 0,

        hunger: 100,

        hydration: 100,

        energy: 100,

        mood: 100,

        intoxication: 0,

        highness: 0,

        hospitalized: false,

        unconscious: false,

        inventory: [],

        effects: [],

        statistics: {

            foodEaten: 0,

            drinksConsumed: 0,

            alcoholConsumed: 0,

            smokeConsumed: 0,

            moneySpent: 0,

            billsPaid: 0

        },

        createdAt: Date.now(),

        updatedAt: Date.now()

    };

    saveAccounts(accounts);

    return accounts[userId];

}

function accountExists(userId) {

    const accounts = loadAccounts();

    return !!accounts[userId];

}

function getAccount(userId) {

    const accounts = loadAccounts();

    return accounts[userId] || null;

}

function getOrCreateAccount(userId, guildId) {

    let account = getAccount(userId);

    if (!account) {

        account = createAccount(userId, guildId);

    }

    return account;

}

function addMoney(userId, amount) {

    const accounts = loadAccounts();

    if (!accounts[userId]) {

        return false;

    }

    accounts[userId].wallet += amount;

    accounts[userId].updatedAt = Date.now();

    saveAccounts(accounts);

    return accounts[userId];

}

function removeMoney(userId, amount) {

    const accounts = loadAccounts();

    if (!accounts[userId]) {

        return false;

    }

    if (accounts[userId].wallet < amount) {

        return false;

    }

    accounts[userId].wallet -= amount;

    accounts[userId].updatedAt = Date.now();

    saveAccounts(accounts);

    return accounts[userId];

}

function addDebt(userId, amount) {

    const accounts = loadAccounts();

    if (!accounts[userId]) {

        return false;

    }

    accounts[userId].debt += amount;

    accounts[userId].statistics.moneySpent += amount;

    accounts[userId].updatedAt = Date.now();

    saveAccounts(accounts);

    return accounts[userId];

}

function clearDebt(userId, amount = null) {

    const accounts = loadAccounts();

    if (!accounts[userId]) {

        return false;

    }

    if (amount === null) {

        accounts[userId].statistics.billsPaid += accounts[userId].debt;

        accounts[userId].debt = 0;

    } else {

        const payment = Math.min(
            amount,
            accounts[userId].debt
        );

        accounts[userId].debt -= payment;

        accounts[userId].statistics.billsPaid += payment;

    }

    accounts[userId].updatedAt = Date.now();

    saveAccounts(accounts);

    return accounts[userId];

}

function updateNeed(userId, need, value) {

    const accounts = loadAccounts();

    if (!accounts[userId]) {

        return false;

    }

    accounts[userId][need] = value;

    accounts[userId].updatedAt = Date.now();

    saveAccounts(accounts);

    return accounts[userId];

}

function addIntoxication(userId, amount) {

    const accounts = loadAccounts();

    if (!accounts[userId]) {

        return false;

    }

    accounts[userId].intoxication += amount;

    accounts[userId].updatedAt = Date.now();

    saveAccounts(accounts);

    return accounts[userId];

}

function addHighness(userId, amount) {

    const accounts = loadAccounts();

    if (!accounts[userId]) {

        return false;

    }

    accounts[userId].highness += amount;

    accounts[userId].updatedAt = Date.now();

    saveAccounts(accounts);

    return accounts[userId];

}

function saveAccount(account) {

    const accounts = loadAccounts();

    account.updatedAt = Date.now();

    accounts[account.id] = account;

    saveAccounts(accounts);

    return account;

}

function getAllAccounts() {

    return Object.values(
        loadAccounts()
    );

}

function deleteAccount(userId) {

    const accounts = loadAccounts();

    if (!accounts[userId]) {

        return false;

    }

    delete accounts[userId];

    saveAccounts(accounts);

    return true;

}
module.exports = {

    loadAccounts,

    saveAccounts,

    createAccount,

    accountExists,

    getAccount,

    getOrCreateAccount,

    addMoney,

    removeMoney,

    addDebt,

    clearDebt,

    updateNeed,

    addIntoxication,

    addHighness,

    saveAccount,

    getAllAccounts,

    deleteAccount

};
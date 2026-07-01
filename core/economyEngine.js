const accountsEngine = require("./accountsEngine");

function getAccount(userId, guildId = null) {

    let account = accountsEngine.getAccount(userId);

    if (!account) {

        account = accountsEngine.createAccount(
            userId,
            guildId
        );

    }

    return account;

}

function saveAccount(account) {

    return accountsEngine.saveAccount(account);

}

function canAfford(userId, amount) {

    const account = getAccount(userId);

    return account.wallet >= amount;

}

function getWallet(userId) {

    return getAccount(userId).wallet;

}

function getBank(userId) {

    return getAccount(userId).bank;

}
function addMoney(userId, amount) {

    const account = getAccount(userId);

    account.wallet += amount;

    saveAccount(account);

    return account;

}

function removeMoney(userId, amount) {

    const account = getAccount(userId);

    if (account.wallet < amount) {

        return false;

    }

    account.wallet -= amount;

    saveAccount(account);

    return account;

}

function deposit(userId, amount) {

    const account = getAccount(userId);

    if (account.wallet < amount) {

        return false;

    }

    account.wallet -= amount;

    account.bank += amount;

    saveAccount(account);

    return account;

}

function withdraw(userId, amount) {

    const account = getAccount(userId);

    if (account.bank < amount) {

        return false;

    }

    account.bank -= amount;

    account.wallet += amount;

    saveAccount(account);

    return account;

}

function purchase(userId, amount) {

    return removeMoney(userId, amount);

}
function addBill(userId, amount) {

    const account = getAccount(userId);

    account.debt += amount;

    account.statistics.moneySpent += amount;

    saveAccount(account);

    return account;

}

function payBill(userId, amount = null) {

    const account = getAccount(userId);

    if (amount === null) {

        amount = account.debt;

    }

    if (account.wallet < amount) {

        return false;

    }

    account.wallet -= amount;

    account.debt = Math.max(

        0,

        account.debt - amount

    );

    account.statistics.billsPaid += amount;

    saveAccount(account);

    return account;

}

function getDebt(userId) {

    return getAccount(userId).debt;

}

function clearDebt(userId) {

    const account = getAccount(userId);

    account.debt = 0;

    saveAccount(account);

    return account;

}

module.exports = {

    getAccount,

    saveAccount,

    canAfford,

    getWallet,

    getBank,

    addMoney,

    removeMoney,

    deposit,

    withdraw,

    purchase,

    addBill,

    payBill,

    getDebt,

    clearDebt

};
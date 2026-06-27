const accountsEngine = require("./accountsEngine");
const lifeEngine = require("./lifeEngine");
const effectsEngine = require("./effectsEngine");
const stockEngine = require("./stockEngine");

let scheduler = null;

function startScheduler() {

    if (scheduler) {

        return;

    }

    scheduler = setInterval(runScheduler, 60000);

}

function stopScheduler() {

    if (!scheduler) {

        return;

    }

    clearInterval(scheduler);

    scheduler = null;

}
function runScheduler() {

    const accounts = accountsEngine.getAllAccounts();

    for (const account of accounts) {

        lifeEngine.updateLife(account.id);

        effectsEngine.tickEffects(account.id);

        effectsEngine.combineEffects(account.id);

    }

    runRestockCycle();

}
let lastRestock = Date.now();

function runRestockCycle() {

    const now = Date.now();

    const THIRTY_MINUTES = 30 * 60 * 1000;

    if (

        now - lastRestock >= THIRTY_MINUTES

    ) {

        if (

            typeof stockEngine.restockAll === "function"

        ) {

            stockEngine.restockAll();

        }

        lastRestock = now;

    }

}
function restartScheduler() {

    stopScheduler();

    startScheduler();

}

function isRunning() {

    return scheduler !== null;

}
module.exports = {

    startScheduler,

    stopScheduler,

    restartScheduler,

    isRunning,

    runScheduler

};
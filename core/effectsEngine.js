const accountsEngine = require("./accountsEngine");

function applyEffect(userId, effect) {

    const account = accountsEngine.getAccount(userId);

    if (!account) {

        return false;

    }

    if (!Array.isArray(account.effects)) {

        account.effects = [];

    }

    const existing = account.effects.find(

        e => e.name === effect.name

    );

    if (existing) {

        existing.duration = effect.duration;

        existing.intensity = effect.intensity;

        existing.appliedAt = Date.now();

    } else {

        account.effects.push({

            name: effect.name,

            intensity: effect.intensity || 0,

            duration: effect.duration || 0,

            appliedAt: Date.now(),

            source: effect.source || "unknown"

        });

    }

    accountsEngine.saveAccount(account);

    return true;

}
function removeEffect(userId, effectName) {

    const account = accountsEngine.getAccount(userId);

    if (!account) {

        return false;

    }

    account.effects = account.effects.filter(

        effect => effect.name !== effectName

    );

    accountsEngine.saveAccount(account);

    return true;

}

function hasEffect(userId, effectName) {

    const account = accountsEngine.getAccount(userId);

    if (!account) {

        return false;

    }

    return account.effects.some(

        effect => effect.name === effectName

    );

}

function getEffects(userId) {

    const account = accountsEngine.getAccount(userId);

    if (!account) {

        return [];

    }

    return account.effects;

}
function tickEffects(userId) {

    const account = accountsEngine.getAccount(userId);

    if (!account) {

        return;

    }

    const now = Date.now();

    account.effects = account.effects.filter(effect => {

        return (

            now - effect.appliedAt

        ) < effect.duration;

    });

    accountsEngine.saveAccount(account);

}
function combineEffects(userId) {

    const account = accountsEngine.getAccount(userId);

    if (!account) {

        return;

    }

    const names = account.effects.map(

        effect => effect.name

    );

    if (

        names.includes("drunk") &&

        names.includes("creative") &&

        !names.includes("crossfaded")

    ) {

        applyEffect(userId, {

            name: "crossfaded",

            intensity: 50,

            duration: 1800000,

            source: "combination"

        });

    }

}
module.exports = {

    applyEffect,

    removeEffect,

    hasEffect,

    getEffects,

    tickEffects,

    combineEffects

};
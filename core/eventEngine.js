const accountsEngine = require("./accountsEngine");
const activityEngine = require("./activityEngine");
const effectsEngine = require("./effectsEngine");
const behaviourEngine = require("./behaviourEngine");
const notificationEngine = require("./notificationEngine");

async function processItemEvent(event) {

    const account = accountsEngine.getAccount(event.userId);

    if (!account) {

        return null;

    }

    applyItemNeeds(account, event.item);

    applyItemEffects(event);

    recordItemActivity(event);

    accountsEngine.saveAccount(account);

    return finishEvent(event);

}
function applyItemNeeds(account, item) {

    if (item.hunger) {

        account.hunger = Math.min(

            100,

            account.hunger + item.hunger

        );

    }

    if (item.hydration) {

        account.hydration = Math.min(

            100,

            account.hydration + item.hydration

        );

    }

    if (item.energy) {

        account.energy = Math.min(

            100,

            account.energy + item.energy

        );

    }

    if (item.mood) {

        account.mood = Math.min(

            100,

            account.mood + item.mood

        );

    }

}
function applyItemEffects(event) {

    if (!event.item.effects) {

        return;

    }

    for (const effect of event.item.effects) {

        effectsEngine.applyEffect(

            event.userId,

            effect

        );

    }

}
function recordItemActivity(event) {

    activityEngine.recordActivity(

        event.userId,

        event.guildId,

        event.item.category

    );

}
function finishEvent(event) {

    const behaviour =

        behaviourEngine.generateBehaviour(

            event.userId

        );

    if (!behaviour) {

        return null;

    }

    return notificationEngine.generateNotification(

        behaviour

    );

}
module.exports = {

    processItemEvent

};
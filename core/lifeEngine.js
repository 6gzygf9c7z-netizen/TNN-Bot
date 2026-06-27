const accountsEngine = require("./accountsEngine");
const effectsEngine = require("./effectsEngine");

function updateLife(userId) {

    const account = accountsEngine.getAccount(userId);

    if (!account) {

        return false;

    }

    processNeeds(account);

    processEffects(account);

    processRecovery(account);

    processStatus(account);

    accountsEngine.saveAccount(account);

    return account;

}

function processNeeds(account) {

    account.hunger = Math.max(0, account.hunger - 1);

    account.hydration = Math.max(0, account.hydration - 1);

    account.energy = Math.max(0, account.energy - 0.5);

}
function processEffects(account) {

    if (!Array.isArray(account.effects)) {

        account.effects = [];

        return;

    }

    for (const effect of account.effects) {

        switch (effect.name) {

            case "drunk":

                account.hydration = Math.max(

                    0,

                    account.hydration - 1

                );

                account.energy = Math.max(

                    0,

                    account.energy - 1

                );

                break;

            case "creative":

                account.hunger = Math.max(

                    0,

                    account.hunger - 1

                );

                account.mood = Math.min(

                    100,

                    account.mood + 1

                );

                break;

            case "hungry":

                account.hunger = Math.max(

                    0,

                    account.hunger - 2

                );

                break;

            case "thirsty":

                account.hydration = Math.max(

                    0,

                    account.hydration - 2

                );

                break;

        }

    }

}
function processRecovery(account) {

    if (

        account.hunger >= 80 &&

        account.hydration >= 80

    ) {

        account.energy = Math.min(

            100,

            account.energy + 1

        );

    }

    if (

        account.energy >= 80 &&

        account.hydration >= 80

    ) {

        account.mood = Math.min(

            100,

            account.mood + 1

        );

    }

}
function processStatus(account) {

    account.unconscious = false;

    account.hospitalized = false;

    if (

        account.hunger <= 5 ||

        account.hydration <= 5 ||

        account.energy <= 5

    ) {

        account.unconscious = true;

    }

    if (

        account.hunger <= 0 ||

        account.hydration <= 0

    ) {

        account.hospitalized = true;

    }

}
module.exports = {

    updateLife,

    processNeeds,

    processEffects,

    processRecovery,

    processStatus

};
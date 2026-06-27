const accountsEngine = require("./accountsEngine");
const activityEngine = require("./activityEngine");
const effectsEngine = require("./effectsEngine");

function generateBehaviour(userId) {

    const account = accountsEngine.getAccount(userId);

    if (!account) {

        return null;

    }

    const behaviour =

        chooseBehaviour(account);

    if (!behaviour) {

        return null;

    }

    return behaviour;

}
function chooseBehaviour(account) {

    const names =

        account.effects.map(

            effect => effect.name

        );

    if (

        names.includes("crossfaded")

    ) {

        return generateCrossfaded(account);

    }

    if (

        names.includes("drunk")

    ) {

        return generateAlcohol(account);

    }

    if (

        names.includes("creative")

    ) {

        return generateCreative(account);

    }

    return generateLifeBehaviour(account);

}
function generateAlcohol(account) {

    return {

        category: "alcohol",

        action: randomChoice([

            "forget",

            "stumble",

            "argue",

            "celebrate",

            "sing"

        ])

    };

}

function generateCreative(account) {

    return {

        category: "creative",

        action: randomChoice([

            "idea",

            "question",

            "philosophy",

            "invent",

            "admire"

        ])

    };

}
function generateCrossfaded(account) {

    const partner =

        activityEngine.getRandomPartner(

            account.guildId,

            "drinking",

            account.id

        );

    return {

        category: "crossfaded",

        partner,

        action: randomChoice([

            "deepConversation",

            "randomBusiness",

            "conspiracy",

            "danceBattle",

            "officeMeeting"

        ])

    };

}
function generateLifeBehaviour(account) {

    if (

        account.hunger < 20

    ) {

        return {

            category: "life",

            action: "lookingForFood"

        };

    }

    if (

        account.energy < 20

    ) {

        return {

            category: "life",

            action: "sleeping"

        };

    }

    return null;

}

function randomChoice(array) {

    return array[

        Math.floor(

            Math.random() *

            array.length

        )

    ];

}
module.exports = {

    generateBehaviour,

    chooseBehaviour,

    generateAlcohol,

    generateCreative,

    generateCrossfaded,

    generateLifeBehaviour

};
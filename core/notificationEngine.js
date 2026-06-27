function generateNotification(event) {

    if (!event) {

        return null;

    }

    switch (event.category) {

        case "alcohol":

            return alcoholMessage(event);

        case "creative":

            return creativeMessage(event);

        case "crossfaded":

            return crossfadedMessage(event);

        case "life":

            return lifeMessage(event);

        default:

            return null;

    }

}
function alcoholMessage(event) {

    const messages = {

        forget: [

            "🍺 Forgot why they entered the room.",

            "🍺 Tried opening an already open door.",

            "🍺 Forgot where they kept their ID card."

        ],

        stumble: [

            "🍺 Walked confidently into the wrong office.",

            "🍺 Nearly saluted a vending machine."

        ],

        argue: [

            "🍺 Started arguing with a chair... and lost."

        ],

        celebrate: [

            "🍺 Celebrated absolutely nothing."

        ],

        sing: [

            "🍺 Suddenly became today's office musician."

        ]

    };

    return random(messages[event.action]);

}
function creativeMessage(event) {

    const messages = {

        idea: [

            "🚬 Just invented a billion naira business idea.",

            "🚬 Wants to sell ice to polar bears."

        ],

        philosophy: [

            "🚬 Asked if elevators have feelings.",

            "🚬 Wonders if bread is a social construct."

        ],

        question: [

            "🚬 Wants to know whether fish get thirsty."

        ],

        invent: [

            "🚬 Designed a company that pays employees in shawarma."

        ],

        admire: [

            "🚬 Has spent ten minutes admiring a ceiling fan."

        ]

    };

    return random(messages[event.action]);

}
function crossfadedMessage(event) {

    const partner =

        event.partner ?

        `<@${event.partner.userId}>`

        :

        "another staff member";

    const messages = {

        deepConversation: [

            `🍺🚬 Started discussing quantum physics with ${partner}.`

        ],

        randomBusiness: [

            `🍺🚬 Tried convincing ${partner} to buy the office printer.`

        ],

        conspiracy: [

            `🍺🚬 Told ${partner} the vending machine runs the company.`

        ],

        danceBattle: [

            `🍺🚬 Challenged ${partner} to a dance battle.`

        ],

        officeMeeting: [

            `🍺🚬 Called an emergency meeting with ${partner} over absolutely nothing.`

        ]

    };

    return random(messages[event.action]);

}
function lifeMessage(event) {

    if (

        event.action === "lookingForFood"

    ) {

        return "🍔 Has started staring at everyone's lunch.";

    }

    if (

        event.action === "sleeping"

    ) {

        return "😴 Fell asleep while standing.";

    }

    return null;

}

function random(array) {

    return array[

        Math.floor(

            Math.random() *

            array.length

        )

    ];

}
module.exports = {

    generateNotification

};
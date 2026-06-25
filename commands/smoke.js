const fs = require('fs');

module.exports = {
    name: 'smoke',

    execute(message, args) {

        const menu = JSON.parse(
            fs.readFileSync('./data/menu.json')
        );

        const inventory = JSON.parse(
            fs.readFileSync('./data/inventory.json')
        );

        const stats = JSON.parse(
            fs.readFileSync('./data/stats.json')
        );

        const userId = message.author.id;

        const itemName = args[0]?.toLowerCase();

        if (!itemName) {
            return message.reply(
                '🚬 Please specify an item to smoke.'
            );
        }

        const item = menu[itemName];

        if (!item) {
            return message.reply(
                '❌ That item does not exist.'
            );
        }

        if (item.category !== 'smoke') {
            return message.reply(
                '❌ That item cannot be smoked.'
            );
        }

        if (
            !inventory[userId] ||
            !inventory[userId][itemName] ||
            inventory[userId][itemName] < 1
        ) {
            return message.reply(
                '📦 You do not own that item.'
            );
        }

        if (!stats[userId]) {

            stats[userId] = {
                hunger: 100,
                hydration: 100,
                nicotine: 0,
                intoxication: 0,
                energy: 100,
                mood: 50
            };

        }

        inventory[userId][itemName]--;

        stats[userId].nicotine += item.nicotine || 0;
        stats[userId].intoxication += item.intoxication || 0;
        stats[userId].mood += item.mood || 0;

        if (stats[userId].nicotine > 100) {
            stats[userId].nicotine = 100;
        }

        if (stats[userId].intoxication > 100) {
            stats[userId].intoxication = 100;
        }

        if (stats[userId].mood > 100) {
            stats[userId].mood = 100;
        }

        fs.writeFileSync(
            './data/inventory.json',
            JSON.stringify(inventory, null, 2)
        );

        fs.writeFileSync(
            './data/stats.json',
            JSON.stringify(stats, null, 2)
        );

        let response =
            `🚬 You smoked ${item.name}.\n`;

        if (stats[userId].intoxication >= 80) {

            const events = [
                '💀 You attempted to salute a vending machine.',
                '💀 You are negotiating with office furniture.',
                '💀 You firmly believe the microwave understands economics.',
                '💀 You tried to unlock a door that was already open.'
            ];

            response +=
                events[
                    Math.floor(
                        Math.random() * events.length
                    )
                ];

        } else if (stats[userId].intoxication >= 60) {

            response +=
                '🤢 Reality appears optional right now.';

        } else if (stats[userId].intoxication >= 40) {

            response +=
                '🥴 You are very, very relaxed.';

        } else if (stats[userId].intoxication >= 20) {

            response +=
                '😌 You are feeling unusually peaceful.';
        }

        message.reply(response);

    }
};
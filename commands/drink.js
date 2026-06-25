const fs = require('fs');

module.exports = {
    name: 'drink',

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
                '🥤 Please specify a drink.'
            );
        }

        const item = menu[itemName];

        if (!item) {
            return message.reply(
                '❌ That item does not exist.'
            );
        }

        if (
            item.category !== 'drink' &&
            item.category !== 'alcohol'
        ) {
            return message.reply(
                '❌ That item is not a drink.'
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
                energy: 100
            };

        }

        inventory[userId][itemName]--;

        if (item.hydration) {
            stats[userId].hydration += item.hydration;
        }

        if (item.energy) {
            stats[userId].energy += item.energy;
        }

        if (item.intoxication) {
            stats[userId].intoxication += item.intoxication;
        }

        if (stats[userId].hydration > 100) {
            stats[userId].hydration = 100;
        }

        if (stats[userId].energy > 100) {
            stats[userId].energy = 100;
        }

        if (stats[userId].intoxication > 100) {
            stats[userId].intoxication = 100;
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
            `🥤 You drank ${item.name}.`;

        if (item.intoxication) {

            if (stats[userId].intoxication >= 80) {
                response +=
                '\n💀 You are absolutely finished.';
            } else if (stats[userId].intoxication >= 60) {
                response +=
                '\n🤢 You are wasted.';
            } else if (stats[userId].intoxication >= 40) {
                response +=
                '\n🥴 You are drunk.';
            } else if (stats[userId].intoxication >= 20) {
                response +=
                '\n🍺 You are tipsy.';
            }

        }

        message.reply(response);

    }
};
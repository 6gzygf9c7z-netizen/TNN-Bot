const fs = require('fs');

module.exports = {
    name: 'eat',

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
                '🍔 Please specify a food item.'
            );
        }

        const item = menu[itemName];

        if (!item) {
            return message.reply(
                '❌ That item does not exist.'
            );
        }

        if (item.category !== 'food') {
            return message.reply(
                '❌ That item is not food.'
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

        stats[userId].hunger += item.hunger;

        if (stats[userId].hunger > 100) {
            stats[userId].hunger = 100;
        }

        fs.writeFileSync(
            './data/inventory.json',
            JSON.stringify(inventory, null, 2)
        );

        fs.writeFileSync(
            './data/stats.json',
            JSON.stringify(stats, null, 2)
        );

        message.reply(
            `🍔 You ate ${item.name}.\n` +
            `Hunger +${item.hunger}`
        );

    }
};
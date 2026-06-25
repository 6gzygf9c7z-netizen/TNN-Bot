const fs = require('fs');

module.exports = {
    name: 'inventory',

    execute(message) {

        const inventory = JSON.parse(
            fs.readFileSync('./data/inventory.json')
        );

        const userId = message.author.id;

        if (
            !inventory[userId] ||
            Object.keys(inventory[userId]).length === 0
        ) {
            return message.reply(
                '🎒 Your inventory is empty.'
            );
        }

        let response =
            `🎒 ${message.author.username}'s Inventory\n\n`;

        let totalItems = 0;

        for (const item in inventory[userId]) {

            const quantity =
                inventory[userId][item];

            response +=
                `• ${item} x${quantity}\n`;

            totalItems += quantity;
        }

        response +=
            `\n📦 Total Items: ${totalItems}`;

        message.reply(response);
    }
};
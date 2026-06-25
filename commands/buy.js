const fs = require('fs');

module.exports = {
    name: 'buy',

    execute(message, args) {

        const menu = JSON.parse(
            fs.readFileSync('./data/menu.json')
        );

        const inventory = JSON.parse(
            fs.readFileSync('./data/inventory.json')
        );

        const debts = JSON.parse(
            fs.readFileSync('./data/debts.json')
        );

        const cafeteria = JSON.parse(
            fs.readFileSync('./data/cafeteria.json')
        );

        const itemName = args[0]?.toLowerCase();
        const quantity = parseInt(args[1]) || 1;

        if (!itemName) {
            return message.reply(
                'Please specify an item to buy.'
            );
        }

        const item = menu[itemName];

        if (!item) {
            return message.reply(
                'That item does not exist on the menu.'
            );
        }

        const userId = message.author.id;

        if (!inventory[userId]) {
            inventory[userId] = {};
        }

        if (!debts[userId]) {
            debts[userId] = {
                cafeteria: 0
            };
        }

        if (!inventory[userId][itemName]) {
            inventory[userId][itemName] = 0;
        }

        inventory[userId][itemName] += quantity;

        const totalCost = item.price * quantity;

        debts[userId].cafeteria += totalCost;

        cafeteria.sales += quantity;
        cafeteria.revenue += totalCost;

        fs.writeFileSync(
            './data/inventory.json',
            JSON.stringify(inventory, null, 2)
        );

        fs.writeFileSync(
            './data/debts.json',
            JSON.stringify(debts, null, 2)
        );

        fs.writeFileSync(
            './data/cafeteria.json',
            JSON.stringify(cafeteria, null, 2)
        );

        message.reply(
            `✅ Purchased ${quantity} ${item.name}(s)\n` +
            `💳 Added ₦${totalCost.toLocaleString()} to your cafeteria debt.`
        );
    }
};
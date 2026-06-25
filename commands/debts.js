const fs = require('fs');

module.exports = {
    name: 'debts',

    execute(message) {

        const debts = JSON.parse(
            fs.readFileSync('./data/debts.json')
        );

        const userId = message.author.id;

        if (!debts[userId]) {
            return message.reply(
                '🎉 You currently owe nothing to the TNN Cafeteria.'
            );
        }

        const userDebt = debts[userId];

        message.reply(
            `💰 Outstanding Cafeteria Debt\n\n` +
            `Amount Owed: ₦${userDebt.toLocaleString()}`
        );
    }
};
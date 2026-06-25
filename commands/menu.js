const fs = require('fs');

module.exports = {
    name: 'menu',

    execute(message) {

        const menu = JSON.parse(
            fs.readFileSync('./data/menu.json')
        );

        let response =
            '🍔 TNN CAFETERIA MENU 🍔\n\n';

        const categories = {
            food: [],
            drink: [],
            alcohol: [],
            smoke: []
        };

        for (const key in menu) {

            const item = menu[key];

            if (categories[item.category]) {

                categories[item.category].push(
                    `${item.name} • ₦${item.price.toLocaleString()}`
                );

            }

        }

        response += '🍔 FOOD\n';
        response +=
            categories.food.join('\n') || 'None';
        response += '\n\n';

        response += '🥤 DRINKS\n';
        response +=
            categories.drink.join('\n') || 'None';
        response += '\n\n';

        response += '🥃 ALCOHOL\n';
        response +=
            categories.alcohol.join('\n') || 'None';
        response += '\n\n';

        response += '🚬 SMOKE\n';
        response +=
            categories.smoke.join('\n') || 'None';

        message.reply(response);

    }
};
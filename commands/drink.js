const {
    getAccount,
    updateNeed,
    removeMoney
} = require("../core/accountsEngine");

const {
    removeItem
} = require("../core/inventoryEngine");

module.exports = {
    name: "drink",
    description: "Drink a beverage",

    async execute(interaction) {

        const beverage = interaction.options.getString("item");

        const account = getAccount(interaction.user.id);

        if (!account) {
            return interaction.reply({
                content: "Create your account first.",
                ephemeral: true
            });
        }

        const inventory = account.inventory || {};

        if (!inventory[beverage] || inventory[beverage] <= 0) {
            return interaction.reply({
                content: `You don't have any ${beverage}.`,
                ephemeral: true
            });
        }

        removeItem(interaction.user.id, beverage, 1);

        updateNeed(interaction.user.id, "thirst", -30);

        await interaction.reply({
            content: `🥤 ${interaction.user.username} drank **${beverage}**.\nThirst reduced by **30**.`
        });
    }
};
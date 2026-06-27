const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getAccount,
    removeMoney,
    saveAccount
} = require("../core/accountsEngine");

const {
    getItem
} = require("../core/inventoryEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item from the cafeteria")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("Item to buy")
                .setRequired(true)
        ),

    async execute(interaction) {

        const itemName = interaction.options
            .getString("item")
            .toLowerCase();

        const account = getAccount(interaction.user.id);

        if (!account) {
            return interaction.reply({
                content: "❌ You don't have an account yet.",
                ephemeral: true
            });
        }

        const item = getItem(itemName);

        if (!item) {
            return interaction.reply({
                content: "❌ That item doesn't exist.",
                ephemeral: true
            });
        }

        if (account.wallet < item.price) {
            return interaction.reply({
                content: "💸 You don't have enough money.",
                ephemeral: true
            });
        }

        removeMoney(interaction.user.id, item.price);

        if (!account.inventory) {
            account.inventory = {};
        }

        if (!account.inventory[itemName]) {
            account.inventory[itemName] = 0;
        }

        account.inventory[itemName]++;

        saveAccount(interaction.user.id, account);

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle("🛒 Purchase Successful")
            .setDescription(
                `You bought **${item.displayName}** for **₦${item.price.toLocaleString()}**.`
            )
            .addFields(
                {
                    name: "Wallet",
                    value: `₦${account.wallet.toLocaleString()}`,
                    inline: true
                },
                {
                    name: "Owned",
                    value: `${account.inventory[itemName]}`,
                    inline: true
                }
            );

        await interaction.reply({
            embeds: [embed]
        });

    }
};
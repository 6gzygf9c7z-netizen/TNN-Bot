const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getAccount
} = require("../core/accountsEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("View your inventory."),

    async execute(interaction) {

        const account = getAccount(interaction.user.id);

        if (!account) {
            return interaction.reply({
                content: "❌ You don't have an account yet.",
                ephemeral: true
            });
        }

        const inventory = account.inventory || {};

        const items = Object.entries(inventory);

        const description = items.length
            ? items
                  .map(([name, amount]) => `• **${name}** × ${amount}`)
                  .join("\n")
            : "Your inventory is empty.";

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle("🎒 Your Inventory")
            .setDescription(description)
            .setFooter({
                text: `Items: ${items.length}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
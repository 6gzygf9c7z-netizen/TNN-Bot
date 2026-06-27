const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const {
    restockItem,
    getItem
} = require("../core/inventoryEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("restock")
        .setDescription("Restock a cafeteria item.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("Item to restock")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("quantity")
                .setDescription("Quantity to add")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {

        const itemName = interaction.options
            .getString("item")
            .toLowerCase();

        const quantity = interaction.options
            .getInteger("quantity");

        const item = getItem(itemName);

        if (!item) {
            return interaction.reply({
                content: "❌ Item not found.",
                ephemeral: true
            });
        }

        restockItem(itemName, quantity);

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle("📦 Stock Updated")
            .setDescription(
                `Successfully added **${quantity}** **${item.displayName}** to inventory.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getAccount,
    updateNeed,
    saveAccount
} = require("../core/accountsEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("eat")
        .setDescription("Eat food from your inventory.")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("Food item to eat")
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const item = interaction.options.getString("item").toLowerCase();

        const account = getAccount(userId);

        if (!account) {
            return interaction.reply({
                content: "❌ You don't have a wallet yet. Use **/wallet** first.",
                ephemeral: true
            });
        }

        if (!account.inventory || !account.inventory[item] || account.inventory[item] <= 0) {
            return interaction.reply({
                content: `❌ You don't own any **${item}**.`,
                ephemeral: true
            });
        }

        account.inventory[item]--;

        updateNeed(userId, "hunger", 35);

        saveAccount(userId, account);

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle("🍽️ Meal Consumed")
            .setDescription(
                `${interaction.user} ate **${item}**.\n\n` +
                `😋 Hunger restored by **35%**.`
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
};
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getAccount,
    updateNeed,
    addHighness,
    addIntoxication,
    saveAccount
} = require("../core/accountsEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("smoke")
        .setDescription("Smoke or consume an intoxicating item.")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("Item to smoke")
                .setRequired(true)
        ),

    async execute(interaction) {

        const userId = interaction.user.id;
        const item = interaction.options.getString("item").toLowerCase();

        const account = getAccount(userId);

        if (!account) {
            return interaction.reply({
                content: "❌ You don't have a wallet yet.",
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

        updateNeed(userId, "stress", -20);

        addHighness(userId, 25);

        addIntoxication(userId, 15);

        saveAccount(userId, account);

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle("🌿 Item Consumed")
            .setDescription(
                `${interaction.user} consumed **${item}**.\n\n` +
                "😌 Stress reduced.\n" +
                "🌿 Highness increased.\n" +
                "🍺 Intoxication increased."
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
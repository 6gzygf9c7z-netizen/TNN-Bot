const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    accountExists,
    createAccount,
    getAccount
} = require("../core/accountsEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wallet")
        .setDescription("View your TNN wallet."),

    async execute(interaction) {

        const userId = interaction.user.id;

        if (!accountExists(userId)) {
            createAccount(userId);
        }

        const account = getAccount(userId);

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle("💳 TNN Wallet")
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                {
                    name: "💵 Cash",
                    value: `₦${account.wallet.toLocaleString()}`,
                    inline: true
                },
                {
                    name: "🏦 Debt",
                    value: `₦${account.debt.toLocaleString()}`,
                    inline: true
                },
                {
                    name: "🍔 Hunger",
                    value: `${account.hunger}%`,
                    inline: true
                },
                {
                    name: "💧 Thirst",
                    value: `${account.thirst}%`,
                    inline: true
                },
                {
                    name: "🚬 Nicotine",
                    value: `${account.nicotine}%`,
                    inline: true
                },
                {
                    name: "🌿 Highness",
                    value: `${account.highness}%`,
                    inline: true
                }
            )
            .setFooter({
                text: "TNN Economy System"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
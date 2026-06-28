const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getOrCreateAccount
} = require("../core/accountsEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("wallet")

        .setDescription("View your TNN Staff Account."),

    async execute(interaction) {

        const guildId = interaction.guild.id;

        const userId = interaction.user.id;

        const account = getOrCreateAccount(

            userId,

            guildId

        );

        const outstandingBills = account.debt || 0;

        const lastUpdated = account.updatedAt
            ? `<t:${Math.floor(account.updatedAt / 1000)}:F>`
            : "Unknown";
                    const embed = new EmbedBuilder()

            .setColor(0x3498DB)

            .setTitle("🏦 TNN STAFF ACCOUNT")

            .setDescription(
                "Financial overview of your employee account."
            )

            .addFields(

                {
                    name: "👤 Employee",
                    value: `${interaction.user}`,
                    inline: false
                },

                {
                    name: "💳 Outstanding Bills",
                    value: `₦${outstandingBills.toLocaleString()}`,
                    inline: true
                },

                {
                    name: "🟢 Account Status",
                    value: outstandingBills > 0
                        ? "Outstanding Bills"
                        : "Clear",
                    inline: true
                },

                {
                    name: "📅 Last Updated",
                    value: lastUpdated,
                    inline: false
                }

            )

            .setFooter({
                text: "TNN Finance Department"
            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getOrCreateAccount
} = require("../core/accountsEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("status")

        .setDescription("View your current physical condition."),

    async execute(interaction) {

        const guildId = interaction.guild.id;

        const userId = interaction.user.id;

        const account = getOrCreateAccount(

            userId,

            guildId

        );

        const hunger = account.hunger ?? 100;

        const hydration = account.hydration ?? 100;

        const energy = account.energy ?? 100;

        const mood = account.mood ?? 100;

        const intoxication = account.intoxication ?? 0;

        const highness = account.highness ?? 0;

        const nicotine = account.nicotine ?? 0;
                const embed = new EmbedBuilder()

            .setColor(0x2ECC71)

            .setTitle("🧬 EMPLOYEE STATUS")

            .addFields(

                {
                    name: "🍗 Hunger",
                    value: `${hunger}%`,
                    inline: true
                },

                {
                    name: "💧 Hydration",
                    value: `${hydration}%`,
                    inline: true
                },

                {
                    name: "⚡ Energy",
                    value: `${energy}%`,
                    inline: true
                },

                {
                    name: "😊 Mood",
                    value: `${mood}%`,
                    inline: true
                },

                {
                    name: "🍺 Intoxication",
                    value: `${intoxication}%`,
                    inline: true
                },

                {
                    name: "🌿 Highness",
                    value: `${highness}%`,
                    inline: true
                },

                {
                    name: "🚬 Nicotine",
                    value: `${nicotine}%`,
                    inline: true
                }

            )

            .setFooter({

                text: "TNN Recreational Unit"

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
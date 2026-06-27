const {
    SlashCommandBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("drink")
        .setDescription("Buy and drink from the TNN Cafeteria."),

    async execute(interaction) {

        await interaction.reply({
            content: "🥤 Cafeteria system is still under construction...",
            ephemeral: true
        });

    }

};
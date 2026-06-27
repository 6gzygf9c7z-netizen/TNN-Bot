const { Events } = require("discord.js");

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction, client) {

        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = client.commands.get(
            interaction.commandName
        );

        if (!command) {
            return;
        }

        try {

            await command.execute(interaction);

        } catch (error) {

            console.error(error);

            const reply = {
                content: "An error occurred while executing this command.",
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }

        }

    }

};
const { Events } = require("discord.js");

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction, client) {

        /*
        ============================
        AUTOCOMPLETE
        ============================
        */

        if (interaction.isAutocomplete()) {

            const command = client.commands.get(

                interaction.commandName

            );

            if (!command?.autocomplete) {

                return;

            }

            try {

                await command.autocomplete(interaction);

            } catch (error) {

                console.error(error);

            }

            return;

        }

        /*
        ============================
        SLASH COMMANDS
        ============================
        */

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

                content: "❌ An error occurred while executing this command.",

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
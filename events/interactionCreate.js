const { Events } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = new Map();

const commandsPath = path.join(__dirname, "..", "commands");

if (fs.existsSync(commandsPath)) {

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        const command = require(
            path.join(commandsPath, file)
        );

        if (
            command.data &&
            command.execute
        ) {

            commands.set(
                command.data.name,
                command
            );

        }

    }

}

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction) {

        if (!interaction.isChatInputCommand()) {

            return;

        }

        const command = commands.get(

            interaction.commandName

        );

        if (!command) {

            return;

        }

        try {

            await command.execute(interaction);

        } catch (error) {

            console.error(error);

            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.followUp({

                    content:
                        "An error occurred while executing this command.",

                    ephemeral: true

                });

            } else {

                await interaction.reply({

                    content:
                        "An error occurred while executing this command.",

                    ephemeral: true

                });

            }

        }

    }

};
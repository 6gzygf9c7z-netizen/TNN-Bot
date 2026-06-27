require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const commands = [];

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(path.join(commandsPath, file));

    if (command.data && command.execute) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`[WARNING] ${file} is missing "data" or "execute".`);
    }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {

    try {

        console.log(`Registering ${commands.length} guild slash commands...`);

        await rest.put(

            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                "1510722666234118245"
            ),

            {
                body: commands
            }

        );

        console.log("Guild slash commands registered successfully!");

    } catch (error) {

        console.error(error);

    }

})();
require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

/*
|--------------------------------------------------------------------------
| Load Slash Commands
|--------------------------------------------------------------------------
*/

const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        const command = require(
            path.join(commandsPath, file)
        );

        if (command.data && command.execute) {

            client.commands.set(
                command.data.name,
                command
            );

        } else {

            console.warn(
                `[WARNING] ${file} is missing "data" or "execute".`
            );

        }

    }

}

/*
|--------------------------------------------------------------------------
| Load Events
|--------------------------------------------------------------------------
*/

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {

    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {

        const event = require(
            path.join(eventsPath, file)
        );

        if (event.once) {

            client.once(
                event.name,
                (...args) => event.execute(...args, client)
            );

        } else {

            client.on(
                event.name,
                (...args) => event.execute(...args, client)
            );

        }

    }

}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

client.login(process.env.TOKEN);
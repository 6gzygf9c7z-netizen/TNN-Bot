const fs = require("fs");
require("dotenv").config();

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = "!";

const commands = new Map();

const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} is online.`);
});

client.on("messageCreate", message => {

    if (message.author.bot) return;

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content
        .slice(PREFIX.length)
        .trim()
        .split(/ +/);

    const commandName = args
        .shift()
        .toLowerCase();

    const command = commands.get(commandName);

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {

        console.error(error);

        message.reply(
            "⚠ TNN Bot encountered an error while executing that command."
        );
    }
});

client.login(process.env.TOKEN);
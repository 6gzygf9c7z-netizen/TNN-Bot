const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`TNN Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === 'hello') {
    message.reply('TNN Bot reporting live... sharp sharp! 📰');
  }
});

client.login(process.env.TOKEN);
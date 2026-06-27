const { Events } = require("discord.js");

module.exports = {

    name: Events.MessageCreate,

    async execute(message) {

        if (message.author.bot) return;

        // Reserved for future prefix commands,
        // logging, AI features and TNN broadcasts.

    }

};
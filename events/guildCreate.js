const { Events } = require("discord.js");

module.exports = {

    name: Events.GuildCreate,

    async execute(guild) {

        console.log(`Joined server: ${guild.name}`);

    }

};
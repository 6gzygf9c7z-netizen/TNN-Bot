const { Events } = require("discord.js");

module.exports = {

    name: Events.GuildDelete,

    async execute(guild) {

        console.log(`Removed from server: ${guild.name}`);

    }

};
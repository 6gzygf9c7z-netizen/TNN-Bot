const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,

    async execute(client) {
        console.log("");

        console.log("==================================");
        console.log("      TNN OS V2 IS ONLINE");
        console.log("==================================");

        console.log(`Logged in as ${client.user.tag}`);

        client.user.setPresence({
            activities: [
                {
                    name: "TNN Media Complex",
                    type: 3
                }
            ],
            status: "online"
        });

        console.log("Bot is ready.");
        console.log("");
    }
};
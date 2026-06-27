const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("View all TNN OS commands."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("📖 TNN OS Command Guide")
            .setDescription("Below are the currently available commands.")
            .addFields(
                {
                    name: "💰 Economy",
                    value:
                        "`/wallet` • View your wallet\n" +
                        "`/inventory` • View your inventory\n" +
                        "`/buy` • Buy an item\n" +
                        "`/eat` • Eat food\n" +
                        "`/drink` • Drink beverages\n" +
                        "`/smoke` • Consume smoking items\n" +
                        "`/clearbills` • Pay outstanding bills",
                    inline: false
                },
                {
                    name: "🍽️ Cafeteria",
                    value:
                        "`/restock` • Restock cafeteria items",
                    inline: false
                },
                {
                    name: "🏢 Organization",
                    value:
                        "`/setup` • Initialize TNN OS\n" +
                        "`/createorganization` • Register an organization\n" +
                        "`/setrole` • Link department roles",
                    inline: false
                },
                {
                    name: "❓ Help",
                    value:
                        "`/help` • Show this command list",
                    inline: false
                }
            )
            .setFooter({
                text: "TNN OS • Version 2"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
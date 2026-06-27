const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const menu = require("../data/menu.json");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("menu")

        .setDescription("View the TNN Cafeteria menu."),

    async execute(interaction) {

        const embed = new EmbedBuilder()

            .setColor(0xF1C40F)

            .setTitle("🍽️ TNN CAFETERIA")

            .setDescription(
                "━━━━━━━━━━━━━━━━━━"
            );

        const categoryIcons = {

            food: "🍔",
            drinks: "🥤",
            alcohol: "🍺",
            smoke: "🌿",
            cigarettes: "🚬"

        };

        for (const [category, items] of Object.entries(menu)) {

            let value = "";

            for (const item of Object.values(items)) {

                value += `• **${item.name}** • ₦${item.price.toLocaleString()}\n`;

            }

            embed.addFields({

                name: `${categoryIcons[category] || "📦"} ${category.toUpperCase()}`,

                value: value || "*No items available.*",

                inline: false

            });

        }

        embed.addFields({

            name: "━━━━━━━━━━━━━━━━━━",

            value:
                "🛒 Purchase items using **/buy**\n\nExample:\n`/buy burger`"

        });

        embed.setFooter({

            text: "TNN Recreational Unit"

        });

        await interaction.reply({

            embeds: [embed]

        });

    }

};
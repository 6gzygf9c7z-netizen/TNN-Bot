const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const menu = require("../data/menu.json");

const {
    getInventory,
    countItems
} = require("../core/inventoryEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("inventory")

        .setDescription("View your cafeteria inventory."),

    async execute(interaction) {

        const guildId = interaction.guild.id;
        const userId = interaction.user.id;

        const inventory = getInventory(
            guildId,
            userId
        );

        if (

            !inventory ||

            Object.keys(inventory).length === 0

        ) {

            return interaction.reply({

                content: "📦 Your inventory is empty.",

                ephemeral: true

            });

        }

        const categories = {

            food: [],

            drinks: [],

            alcohol: [],

            smoke: [],

            cigarettes: []

        };

        for (const [itemId, data] of Object.entries(inventory)) {

            for (const [categoryName, category] of Object.entries(menu)) {

                if (category[itemId]) {

                    categories[categoryName].push(

                        `• **${category[itemId].name}** × ${data.quantity}`

                    );

                    break;

                }

            }

        }
                const embed = new EmbedBuilder()

            .setColor(0x3498DB)

            .setTitle("📦 Your Inventory")

            .setDescription(

                "Items currently stored in your personal cafeteria inventory."

            );

        if (categories.food.length) {

            embed.addFields({

                name: "🍔 Foods",

                value: categories.food.join("\n"),

                inline: false

            });

        }

        if (categories.drinks.length) {

            embed.addFields({

                name: "🥤 Drinks",

                value: categories.drinks.join("\n"),

                inline: false

            });

        }

        if (categories.alcohol.length) {

            embed.addFields({

                name: "🍺 Alcohol",

                value: categories.alcohol.join("\n"),

                inline: false

            });

        }

        if (categories.smoke.length) {

            embed.addFields({

                name: "🌿 Cannabis",

                value: categories.smoke.join("\n"),

                inline: false

            });

        }

        if (categories.cigarettes.length) {

            embed.addFields({

                name: "🚬 Cigarettes",

                value: categories.cigarettes.join("\n"),

                inline: false

            });

        }

        embed

            .addFields({

                name: "📊 Total Items",

                value: `${countItems(guildId, userId)}`,

                inline: true

            })

            .setFooter({

                text: "TNN Cafeteria Inventory"

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
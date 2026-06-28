const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const menu = require("../data/menu.json");

const {
    getOrCreateAccount,
    saveAccount
} = require("../core/accountEngine");

const {
    hasItem,
    removeItem
} = require("../core/inventoryEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("eat")

        .setDescription("Eat food from your inventory.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Food to eat")

                .setRequired(true)

        ),

    async execute(interaction) {

        const guildId = interaction.guild.id;

        const userId = interaction.user.id;

        const input = interaction.options
            .getString("item")
            .trim()
            .toLowerCase();

        const account = getOrCreateAccount(
            userId,
            guildId
        );

        let itemId = null;

        let food = null;

        for (const [id, item] of Object.entries(menu.food)) {

            if (

                item.name.toLowerCase() === input ||

                id === input

            ) {

                itemId = id;

                food = item;

                break;

            }

        }

        if (!food) {

            return interaction.reply({

                content: "❌ That food doesn't exist.",

                ephemeral: true

            });

        }

        if (

            !hasItem(

                guildId,

                userId,

                itemId

            )

        ) {

            return interaction.reply({

                content: `❌ You don't own any **${food.name}**.`,

                ephemeral: true

            });

        }

        removeItem(

            guildId,

            userId,

            itemId,

            1

        );

        account.hunger = Math.min(

            100,

            (account.hunger || 100) + 35

        );
                account.updatedAt = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(0x2ECC71)

            .setTitle("🍽️ Meal Consumed")

            .setDescription(

                `${interaction.user} ate **${food.name}**.\n\n😋 Delicious!`

            )

            .addFields(

                {

                    name: "🍗 Hunger",

                    value: `${account.hunger}%`,

                    inline: true

                },

                {

                    name: "📦 Inventory",

                    value: `1 × ${food.name} consumed`,

                    inline: true

                }

            )

            .setFooter({

                text: "TNN Cafeteria"

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
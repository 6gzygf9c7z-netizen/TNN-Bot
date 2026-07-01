const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const menu = require("../data/menu.json");

const {
    getOrCreateAccount,
    saveAccount
} = require("../core/accountsEngine");

const {
    hasItem,
    removeItem
} = require("../core/inventoryEngine");

const {
    getOrganization
} = require("../core/organizationEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("eat")

        .setDescription("Eat food from your inventory.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Food to eat")

                .setRequired(true)

                .setAutocomplete(true)

        ),

    async autocomplete(interaction) {

        const focused = interaction.options
            .getFocused()
            .toLowerCase();

        const choices = [];

        if (menu.food) {

            Object.entries(menu.food).forEach(([id, item]) => {

                choices.push({

                    name: item.name,

                    value: id

                });

            });

        }

        const filtered = choices

            .filter(choice =>

                choice.name.toLowerCase().includes(focused)

            )

            .slice(0, 25);

        return interaction.respond(filtered);

    },

    async execute(interaction) {

        const guildId = interaction.guild.id;

        const userId = interaction.user.id;

        const organization = getOrganization(guildId);

        const itemId = interaction.options

            .getString("item")

            .trim()

            .toLowerCase();

        const account = getOrCreateAccount(

            userId,

            guildId

        );

        const food = menu.food?.[itemId];

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

        const hungerGain = Math.floor(

            Math.random() * 15

        ) + 15;

        account.hunger = Math.min(

            100,

            (account.hunger || 0) + hungerGain

        );

        account.mood = Math.min(

            100,

            (account.mood || 50) + 3

        );

        let effectMessage = "";

        if (account.hunger <= 20) {

            effectMessage = "😬 You're still hungry... maybe grab another meal.";

        } else if (account.hunger <= 50) {

            effectMessage = "🙂 That helped... you're feeling better.";

        } else if (account.hunger <= 80) {

            effectMessage = "😋 Delicious... you're comfortably full.";

        } else {

            effectMessage = "🤰 You're absolutely stuffed... no more food for now.";

        }

        account.updatedAt = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(0xF1C40F)

            .setTitle("🍽️ Meal Enjoyed")

            .setDescription(

                `${interaction.user} ate **${food.name}**.\n\n${effectMessage}`

            )

            .addFields(

                {

                    name: "🍔 Hunger",

                    value: `${account.hunger}%`,

                    inline: true

                },

                {

                    name: "😊 Mood",

                    value: `${account.mood}%`,

                    inline: true

                }

            )

            .setFooter({

                text: `${organization?.name || "Organization"} Cafeteria`

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
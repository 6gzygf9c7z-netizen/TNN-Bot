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

const {
    applyEffect,
    combineEffects
} = require("../core/effectsEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("smoke")

        .setDescription("Smoke cannabis from your inventory.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Cannabis strain to smoke")

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

        let strain = null;

        for (const [id, item] of Object.entries(menu.smoke)) {

            if (

                item.name.toLowerCase() === input ||

                id === input

            ) {

                itemId = id;

                strain = item;

                break;

            }

        }

        if (!strain) {

            return interaction.reply({

                content: "❌ That strain doesn't exist.",

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

                content: `❌ You don't own any **${strain.name}**.`,

                ephemeral: true

            });

        }

        removeItem(

            guildId,

            userId,

            itemId,

            1

        );

        account.highness = Math.min(

            100,

            (account.highness || 0) + (Math.floor(Math.random() * 15) + 10)

        );
                applyEffect(userId, {

            name: "creative",

            intensity: account.highness,

            duration: 30 * 60 * 1000,

            source: itemId

        });

        combineEffects(userId);

        let effectMessage = "";

        const funnyMessages = [

            "😌 You suddenly understand the meaning of life... maybe.",

            "😂 Everything is hilarious right now.",

            "🤔 You started debating with yourself... and you're losing.",

            "🛋️ That couch looks extremely comfortable.",

            "🍕 You're convinced food has never smelled this good.",

            "🎨 You're feeling incredibly creative.",

            "🚀 Your mind is travelling through another dimension."

        ];

        if (account.highness <= 15) {

            effectMessage = funnyMessages[0];

        } else if (account.highness <= 30) {

            effectMessage = funnyMessages[1];

        } else if (account.highness <= 45) {

            effectMessage = funnyMessages[2];

        } else if (account.highness <= 60) {

            effectMessage = funnyMessages[3];

        } else if (account.highness <= 80) {

            effectMessage = funnyMessages[4];

        } else if (account.highness <= 95) {

            effectMessage = funnyMessages[5];

        } else {

            effectMessage = funnyMessages[6];

        }

        account.updatedAt = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(0x27AE60)

            .setTitle("🌿 Smoke Session")

            .setDescription(

                `${interaction.user} smoked **${strain.name}**.\n\n${effectMessage}`

            )

            .addFields(

                {

                    name: "🌿 Highness",

                    value: `${account.highness}%`,

                    inline: true

                },

                {

                    name: "🧠 Effect",

                    value: "Creative",

                    inline: true

                }

            )

            .setFooter({

                text: "TNN Recreational Unit"

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
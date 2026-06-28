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

        .setName("drink")

        .setDescription("Drink an item from your inventory.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Drink to consume")

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

        let drink = null;

        let isAlcohol = false;

        for (const [id, item] of Object.entries(menu.drinks)) {

            if (

                item.name.toLowerCase() === input ||

                id === input

            ) {

                itemId = id;

                drink = item;

                break;

            }

        }

        if (!drink) {

            for (const [id, item] of Object.entries(menu.alcohol)) {

                if (

                    item.name.toLowerCase() === input ||

                    id === input

                ) {

                    itemId = id;

                    drink = item;

                    isAlcohol = true;

                    break;

                }

            }

        }

        if (!drink) {

            return interaction.reply({

                content: "❌ That drink doesn't exist.",

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

                content: `❌ You don't own any **${drink.name}**.`,

                ephemeral: true

            });

        }

        removeItem(

            guildId,

            userId,

            itemId,

            1

        );

        account.hydration = Math.min(

            100,

            (account.hydration || 100) + 20

        );
                let emoji = "🥤";

        let effectMessage = "";

        if (isAlcohol) {

            const gain = Math.floor(Math.random() * 15) + 10;

            account.intoxication = Math.min(
                100,
                (account.intoxication || 0) + gain
            );

            applyEffect(userId, {

                name: "drunk",

                intensity: account.intoxication,

                duration: 30 * 60 * 1000,

                source: itemId

            });

            combineEffects(userId);

            emoji = "🍺";

            const funnyMessages = [

                "🙂 You feel slightly tipsy...",

                "😅 You're talking a little louder than usual...",

                "🥴 You suddenly think you're the smartest person in the room...",

                "🤣 You greeted the refrigerator by mistake...",

                "🤪 You're dancing to music nobody else can hear...",

                "🤢 Walking in a straight line is becoming difficult...",

                "☠️ You're completely wasted..."

            ];

            if (account.intoxication <= 15) {

                effectMessage = funnyMessages[0];

            } else if (account.intoxication <= 30) {

                effectMessage = funnyMessages[1];

            } else if (account.intoxication <= 45) {

                effectMessage = funnyMessages[2];

            } else if (account.intoxication <= 60) {

                effectMessage = funnyMessages[3];

            } else if (account.intoxication <= 80) {

                effectMessage = funnyMessages[4];

            } else if (account.intoxication <= 95) {

                effectMessage = funnyMessages[5];

            } else {

                effectMessage = funnyMessages[6];

            }

        } else {

            account.intoxication = Math.max(

                0,

                (account.intoxication || 0) - 5

            );

            effectMessage = "💧 Refreshing... you're feeling hydrated.";

        }

        account.updatedAt = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(

                isAlcohol ? 0xE67E22 : 0x3498DB

            )

            .setTitle(`${emoji} Drink Consumed`)

            .setDescription(

                `${interaction.user} drank **${drink.name}**.\n\n${effectMessage}`

            )

            .addFields(

                {

                    name: "💧 Hydration",

                    value: `${account.hydration}%`,

                    inline: true

                },

                {

                    name: "🍺 Intoxication",

                    value: `${account.intoxication || 0}%`,

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
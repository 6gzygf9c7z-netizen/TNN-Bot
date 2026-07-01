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
    applyEffect,
    combineEffects
} = require("../core/effectsEngine");

const {
    getOrganization
} = require("../core/organizationEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("drink")

        .setDescription("Drink an item from your inventory.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Drink to consume")

                .setRequired(true)

                .setAutocomplete(true)

        ),

    async autocomplete(interaction) {

        const focused = interaction.options
            .getFocused()
            .toLowerCase();

        const choices = [];

        if (menu.drinks) {

            Object.entries(menu.drinks).forEach(([id, item]) => {

                choices.push({

                    name: item.name,

                    value: id

                });

            });

        }

        if (menu.alcohol) {

            Object.entries(menu.alcohol).forEach(([id, item]) => {

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

        let drink = null;

        let isAlcohol = false;

        if (menu.drinks && menu.drinks[itemId]) {

            drink = menu.drinks[itemId];

        }

        if (menu.alcohol && menu.alcohol[itemId]) {

            drink = menu.alcohol[itemId];

            isAlcohol = true;

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

            (account.hydration || 0) + 20

        );

        let emoji = "🥤";

        let effectMessage = "💧 Refreshing...";

        if (isAlcohol) {

            const intoxicationGain = Math.floor(

                Math.random() * 15

            ) + 10;

            account.intoxication = Math.min(

                100,

                (account.intoxication || 0) + intoxicationGain

            );

            applyEffect(userId, {

                name: "drunk",

                intensity: account.intoxication,

                duration: 30 * 60 * 1000,

                source: itemId

            });

            combineEffects(userId);

            emoji = "🍺";

            if (account.intoxication <= 20) {

                effectMessage = "🙂 You feel slightly tipsy...";

            } else if (account.intoxication <= 40) {

                effectMessage = "🥴 You're starting to feel it...";

            } else if (account.intoxication <= 70) {

                effectMessage = "🍻 You're obviously drunk now.";

            } else {

                effectMessage = "☠️ You're completely wasted.";

            }

            if (

                organization?.drunkRole

            ) {

                const role = interaction.guild.roles.cache.get(

                    organization.drunkRole

                );

                if (

                    role &&

                    interaction.guild.members.me.roles.highest.position >

                    role.position &&

                    !interaction.member.roles.cache.has(role.id)

                ) {

                    await interaction.member.roles.add(role).catch(() => {});

                }

            }

        }

        account.updatedAt = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(

                isAlcohol

                    ? 0xE67E22

                    : 0x3498DB

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

                text: `${organization?.name || "Organization"} Cafeteria`

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
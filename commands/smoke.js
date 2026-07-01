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

        .setName("smoke")

        .setDescription("Smoke cannabis or cigarettes.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Choose what to smoke")

                .setRequired(true)

                .setAutocomplete(true)

        ),

    async autocomplete(interaction) {

        const focused = interaction.options
            .getFocused()
            .toLowerCase();

        const choices = [];

        if (menu.smoke) {

            Object.entries(menu.smoke).forEach(([id, item]) => {

                choices.push({

                    name: item.name,

                    value: id

                });

            });

        }

        if (menu.cigarettes) {

            Object.entries(menu.cigarettes).forEach(([id, item]) => {

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

        let smoke = null;

        let isSmoke = false;

        let isCigarette = false;

        if (menu.smoke && menu.smoke[itemId]) {

            smoke = menu.smoke[itemId];

            isSmoke = true;

        }

        if (menu.cigarettes && menu.cigarettes[itemId]) {

            smoke = menu.cigarettes[itemId];

            isCigarette = true;

        }

        if (!smoke) {

            return interaction.reply({

                content: "❌ That smoking item doesn't exist.",

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

                content: `❌ You don't own any **${smoke.name}**.`,

                ephemeral: true

            });


        }
                removeItem(

            guildId,

            userId,

            itemId,

            1

        );

        let emoji = "🚬";

        let effectMessage = "";

        if (isSmoke) {

            const highGain = Math.floor(

                Math.random() * 15

            ) + 10;

            account.highness = Math.min(

                100,

                (account.highness || 0) + highGain

            );

            applyEffect(userId, {

                name: "high",

                intensity: account.highness,

                duration: 30 * 60 * 1000,

                source: itemId

            });

            combineEffects(userId);

            emoji = "🌿";

            if (account.highness <= 20) {

                effectMessage = "😌 You feel relaxed...";

            } else if (account.highness <= 40) {

                effectMessage = "😂 Everything suddenly seems funnier.";

            } else if (account.highness <= 70) {

                effectMessage = "🍕 The munchies have arrived...";

            } else {

                effectMessage = "🚀 You've completely left planet Earth.";

            }

            if (

                organization?.highRole

            ) {

                const role = interaction.guild.roles.cache.get(

                    organization.highRole

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

        if (isCigarette) {

            account.nicotine = Math.min(

                100,

                (account.nicotine || 0) + 10

            );

            emoji = "🚬";

            if (account.nicotine <= 20) {

                effectMessage = "😮‍💨 A quick smoke break.";

            } else if (account.nicotine <= 40) {

                effectMessage = "🚬 You're starting to crave another one.";

            } else if (account.nicotine <= 70) {

                effectMessage = "😵 Nicotine is taking over.";

            } else {

                effectMessage = "☠️ You're chain smoking at this point.";

            }

        }

        account.updatedAt = Date.now();

        saveAccount(account);
                const embed = new EmbedBuilder()

            .setColor(

                isSmoke

                    ? 0x2ECC71

                    : 0x95A5A6

            )

            .setTitle(`${emoji} Smoke Session`)

            .setDescription(

                `${interaction.user} smoked **${smoke.name}**.\n\n${effectMessage}`

            )

            .addFields(

                {

                    name: "🌿 Highness",

                    value: `${account.highness || 0}%`,

                    inline: true

                },

                {

                    name: "🚬 Nicotine",

                    value: `${account.nicotine || 0}%`,

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
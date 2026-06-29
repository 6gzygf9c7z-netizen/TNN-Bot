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

        .setDescription("Smoke cannabis or cigarettes from your inventory.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("What you want to smoke")

                .setRequired(true)

        ),

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

        let isCannabis = false;

        let isCigarette = false;

        if (menu.cannabis && menu.cannabis[itemId]) {

            smoke = menu.cannabis[itemId];

            isCannabis = true;

        }

        if (menu.cigarettes && menu.cigarettes[itemId]) {

            smoke = menu.cigarettes[itemId];

            isCigarette = true;

        }

        if (!smoke) {

            return interaction.reply({

                content: "❌ That item doesn't exist.",

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

        let effectMessage = "";

        let emoji = "🚬";

        if (isCannabis) {

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

                effectMessage = "😌 You feel relaxed... everything seems calmer.";

            } else if (account.highness <= 40) {

                effectMessage = "😂 You're smiling at absolutely nothing.";

            } else if (account.highness <= 70) {

                effectMessage = "🍕 You're convinced food has never tasted this good.";

            } else {

                effectMessage = "🚀 You've left planet Earth... enjoy the trip.";

            }

            if (

                organization?.highRole &&

                interaction.guild.members.me.roles.highest.position >

                interaction.guild.roles.cache.get(

                    organization.highRole

                )?.position

            ) {

                await interaction.member.roles.add(

                    organization.highRole

                ).catch(() => {});

            }

        }

        if (isCigarette) {

            const nicotineGain = Math.floor(

                Math.random() * 10

            ) + 5;

            account.nicotine = Math.min(

                100,

                (account.nicotine || 0) + nicotineGain

            );

            emoji = "🚬";

            if (account.nicotine <= 20) {

                effectMessage = "😮‍💨 A light puff... nothing too serious.";

            } else if (account.nicotine <= 40) {

                effectMessage = "🚬 You needed that smoke break.";

            } else if (account.nicotine <= 70) {

                effectMessage = "😵 You're becoming heavily dependent on nicotine.";

            } else {

                effectMessage = "☠️ Chain smoking isn't doing your lungs any favours.";

            }

        }

        account.updatedAt = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(

                isCannabis

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
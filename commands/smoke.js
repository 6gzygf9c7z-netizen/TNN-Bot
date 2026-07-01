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
    getInventory,
    removeItem
} = require("../core/inventoryEngine");

const {
    applyEffect,
    combineEffects
} = require("../core/effectEngine");

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
                .setDescription("Item to smoke")
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

        const itemId = interaction.options.getString("item");

        const inventory = getInventory(guildId, userId);

        if (!inventory[itemId] || inventory[itemId] <= 0) {

            return interaction.reply({

                content: "❌ You don't own this item.",

                ephemeral: true

            });

        }

        let smoke = null;

        let isCannabis = false;

        let isCigarette = false;

        if (menu.smoke && menu.smoke[itemId]) {

            smoke = menu.smoke[itemId];

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

        const account = getOrCreateAccount(

            guildId,

            userId

        );
                removeItem(

            guildId,

            userId,

            itemId,

            1

        );

        if (isSmoke) {

            account.highness = Math.min(

                100,

                (account.highness || 0) + 25

            );

            account.mood = Math.min(

                100,

                (account.mood || 50) + 5

            );

            account.energy = Math.max(

                0,

                (account.energy || 100) - 3

            );

            applyEffect(

                account,

                smoke.currentEffect || itemId

            );

        }

        if (isCigarette) {

            account.nicotine = Math.min(

                100,

                (account.nicotine || 0) + 10

            );

            account.stress = Math.max(

                0,

                (account.stress || 0) - 5

            );

        }

        combineEffects(account);

        saveAccount(

            guildId,

            userId,

            account

        );

        const embed = new EmbedBuilder()

            .setColor(isSmoke ? 0x57F287 : 0x95A5A6)

            .setTitle("🚬 Smoke Session")

            .setDescription(

                `${interaction.user} smoked **${smoke.name}**.`

            )

            .addFields(

                {

                    name: isSmoke ? "🌿 Highness" : "🚬 Nicotine",

                    value: isSmoke

                        ? `${account.highness}%`

                        : `${account.nicotine}%`,

                    inline: true

                }

            )

            .setFooter({

                text: `${organization?.name || "Organization"} Cafeteria`

            })

            .setTimestamp();
                    if (

            isSmoke &&

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

        return interaction.reply({

            embeds: [embed]

        });

    }

};
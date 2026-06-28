const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getOrCreateAccount,
    saveAccount
} = require("../core/accountsEngine");

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

                .setDescription("Food item to eat")

                .setRequired(true)

        ),

    async execute(interaction) {

        const guildId = interaction.guild.id;

        const userId = interaction.user.id;

        const item = interaction.options
            .getString("item")
            .trim()
            .toLowerCase();

        const account = getOrCreateAccount(

            userId,

            guildId

        );

        if (

            !hasItem(

                guildId,

                userId,

                item

            )

        ) {

            return interaction.reply({

                content: `❌ You don't own any **${item}**.`,

                ephemeral: true

            });

        }

        removeItem(

            guildId,

            userId,

            item,

            1

        );

        account.hunger = Math.min(

            100,

            account.hunger + 35

        );
                account.updatedAt = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(0x2ECC71)

            .setTitle("🍽️ Meal Consumed")

            .setDescription(

                `${interaction.user} ate **${item}**.`

            )

            .addFields(

                {

                    name: "😋 Hunger",

                    value: `${account.hunger}%`,

                    inline: true

                },

                {

                    name: "📦 Inventory",

                    value: `1 × ${item} consumed`,

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
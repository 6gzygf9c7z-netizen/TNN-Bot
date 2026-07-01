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
    addItem
} = require("../core/inventoryEngine");

const {
    addBill
} = require("../core/economyEngine");

const {
    getOrganization
} = require("../core/organizationEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("buy")

        .setDescription("Buy an item from the cafeteria.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Item to purchase")

                .setRequired(true)

                .setAutocomplete(true)

        )

        .addIntegerOption(option =>

            option

                .setName("quantity")

                .setDescription("Quantity")

                .setMinValue(1)

                .setRequired(false)

        ),

    async autocomplete(interaction) {

        const focused = interaction.options
            .getFocused()
            .toLowerCase();

        const choices = [];

        for (const category of Object.values(menu)) {

            if (!category || typeof category !== "object") continue;

            for (const [id, item] of Object.entries(category)) {

                if (!item?.name) continue;

                choices.push({

                    name: item.name,

                    value: id

                });

            }

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

        const account = getOrCreateAccount(

            userId,

            guildId

        );

        const itemId = interaction.options.getString("item");

        const quantity = interaction.options.getInteger("quantity") || 1;
                let item = null;

        let categoryName = null;

        for (const [category, items] of Object.entries(menu)) {

            if (!items || typeof items !== "object") continue;

            if (items[itemId]) {

                item = items[itemId];

                categoryName = category;

                break;

            }

        }

        if (!item) {

            return interaction.reply({

                content: "❌ That item doesn't exist.",

                ephemeral: true

            });

        }

        const totalCost = item.price * quantity;

        addBill(

            guildId,

            userId,

            {

                type: "cafeteria",

                item: item.name,

                quantity,

                amount: totalCost,

                timestamp: Date.now()

            }

        );

        addItem(

            guildId,

            userId,

            itemId,

            quantity

        );

        account.updatedAt = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(0x3498DB)

            .setTitle("🛒 Purchase Successful")

            .setDescription(

                `${interaction.user} purchased **${quantity} × ${item.name}**.`

            )

            .addFields(

                {

                    name: "Category",

                    value: categoryName,

                    inline: true

                },

                {

                    name: "Unit Price",

                    value: `₦${item.price.toLocaleString()}`,

                    inline: true

                },

                {

                    name: "Total Bill",

                    value: `₦${totalCost.toLocaleString()}`,

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
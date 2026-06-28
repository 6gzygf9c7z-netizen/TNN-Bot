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
    createInventory,
    addItem
} = require("../core/inventoryEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("buy")

        .setDescription("Purchase an item from the TNN Cafeteria.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Item to purchase")

                .setRequired(true)

        ),

    async execute(interaction) {

        const search = interaction.options
            .getString("item")
            .trim()
            .toLowerCase();

        let selectedItem = null;
        let selectedItemId = null;
        let selectedCategory = null;

        for (const [categoryName, category] of Object.entries(menu)) {

            for (const [itemId, item] of Object.entries(category)) {

                if (

                    item.name.toLowerCase() === search ||

                    itemId.toLowerCase() === search ||

                    item.currentEffect.toLowerCase() === search

                ) {

                    selectedItem = item;
                    selectedItemId = itemId;
                    selectedCategory = categoryName;

                    break;

                }

            }

            if (selectedItem) break;

        }

        if (!selectedItem) {

            return interaction.reply({

                content: "❌ Item not found on the cafeteria menu.",

                ephemeral: true

            });

        }

        const account = getOrCreateAccount(

            interaction.user.id,

            interaction.guild.id

        );

        createInventory(

            interaction.guild.id,

            interaction.user.id

        );
                account.debt += selectedItem.price;

        account.statistics.moneySpent += selectedItem.price;

        account.updatedAt = Date.now();

        saveAccount(account);

        addItem(

            interaction.guild.id,

            interaction.user.id,

            selectedItemId,

            1

        );

        const icons = {

            food: "🍔",

            drinks: "🥤",

            alcohol: "🍺",

            smoke: "🌿",

            cigarettes: "🚬"

        };

        const embed = new EmbedBuilder()

            .setColor(0x2ECC71)

            .setTitle("🛒 Cafeteria Purchase")

            .setDescription(

                `${icons[selectedCategory] || "📦"} **${selectedItem.name}** has been added to your inventory.`

            )

            .addFields(

                {

                    name: "Payment Method",

                    value: "🏢 Company Credit",

                    inline: true

                },

                {

                    name: "Purchase Cost",

                    value: `₦${selectedItem.price.toLocaleString()}`,

                    inline: true

                },

                {

                    name: "Outstanding Debt",

                    value: `₦${account.debt.toLocaleString()}`,

                    inline: true

                },

                {

                    name: "Inventory Updated",

                    value: `✅ 1 × ${selectedItem.name}`,

                    inline: false

                }

            )

            .setFooter({

                text: "Bills can be settled later using /clearbills"

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
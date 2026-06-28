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

                .setDescription("Name of the item you want to buy.")

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

                content: "❌ That item does not exist on today's cafeteria menu.",

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

        if (account.wallet < selectedItem.price) {

            return interaction.reply({

                content:
                    `❌ You need **₦${selectedItem.price.toLocaleString()}** but only have **₦${account.wallet.toLocaleString()}**.`,

                ephemeral: true

            });

        }
                account.wallet -= selectedItem.price;

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

            .setTitle("🛒 Purchase Successful")

            .setDescription(

                `${icons[selectedCategory] || "📦"} You purchased **${selectedItem.name}**`

            )

            .addFields(

                {

                    name: "Price",

                    value: `₦${selectedItem.price.toLocaleString()}`,

                    inline: true

                },

                {

                    name: "Remaining Wallet",

                    value: `₦${account.wallet.toLocaleString()}`,

                    inline: true

                },

                {

                    name: "Inventory",

                    value: `1 × ${selectedItem.name} added.`,

                    inline: false

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
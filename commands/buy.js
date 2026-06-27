const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const menu = require("../data/menu.json");

const {
    getAccount,
    saveAccount
} = require("../core/accountsEngine");

const {
    addItem
} = require("../core/inventoryEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("buy")

        .setDescription("Purchase an item from the cafeteria.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Item to purchase")

                .setRequired(true)

        ),

    async execute(interaction) {

        const account = getAccount(interaction.user.id);

        if (!account) {

            return interaction.reply({

                content: "❌ You don't have an account yet.",

                ephemeral: true

            });

        }

        const search = interaction.options
            .getString("item")
            .toLowerCase();

        let selectedItem = null;

        for (const category of Object.values(menu)) {

            for (const item of Object.values(category)) {

                if (

                    item.name.toLowerCase() === search

                ) {

                    selectedItem = item;

                    break;

                }

            }

            if (selectedItem) break;

        }

        if (!selectedItem) {

            return interaction.reply({

                content: "❌ Item not found on the menu.",

                ephemeral: true

            });

        }

        if (account.wallet < selectedItem.price) {

            return interaction.reply({

                content:
                    `❌ You need ₦${selectedItem.price.toLocaleString()} but only have ₦${account.wallet.toLocaleString()}.`,

                ephemeral: true

            });

        }

        account.wallet -= selectedItem.price;

        saveAccount(account);

        addItem(

            interaction.user.id,

            selectedItem.name,

            1

        );

        const embed = new EmbedBuilder()

            .setColor(0x2ECC71)

            .setTitle("🛒 Purchase Successful")

            .setDescription(

                `You bought **${selectedItem.name}** for **₦${selectedItem.price.toLocaleString()}**.`

            )

            .addFields({

                name: "Wallet Balance",

                value: `₦${account.wallet.toLocaleString()}`

            })

            .setTimestamp();

        await interaction.reply({

            embeds: [embed]

        });

    }

};
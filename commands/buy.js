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
                .setDescription("Select an item to purchase")
                .setRequired(true)
                .setAutocomplete(true)

        ),

    async autocomplete(interaction) {

        const focused = interaction.options
            .getFocused()
            .toLowerCase();

        const choices = [];

        for (const category of Object.values(menu)) {

            for (const [itemId, item] of Object.entries(category)) {

                choices.push({
                    name: item.name,
                    value: itemId
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

        const account = getAccount(userId);

        if (!account) {

            return interaction.reply({

                content:
                    "❌ You don't have an account yet.",

                ephemeral: true

            });

        }

        const itemId = interaction.options.getString("item");

        let selectedItem = null;

        for (const category of Object.values(menu)) {

            if (category[itemId]) {

                selectedItem = category[itemId];

                break;

            }

        }

        if (!selectedItem) {

            return interaction.reply({

                content:
                    "❌ That item doesn't exist.",

                ephemeral: true

            });

        }
                account.debt += selectedItem.price;

        if (!account.statistics) {

            account.statistics = {};

        }

        account.statistics.moneySpent =
            (account.statistics.moneySpent || 0) +
            selectedItem.price;

        saveAccount(account);

        addItem(

            guildId,

            userId,

            itemId,

            1

        );

        const embed = new EmbedBuilder()

            .setColor(0xF39C12)

            .setTitle("🛒 Purchase Successful")

            .setDescription(

                `You purchased **${selectedItem.name}**.`

            )

            .addFields(

                {

                    name: "💳 Added to Debt",

                    value: `₦${selectedItem.price.toLocaleString()}`,

                    inline: true

                },

                {

                    name: "📋 Total Debt",

                    value: `₦${account.debt.toLocaleString()}`,

                    inline: true

                }

            )

            .setFooter({

                text: "TNN Cafeteria • Payment will be deducted from your next salary."

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
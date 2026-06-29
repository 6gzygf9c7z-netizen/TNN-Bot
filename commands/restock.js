const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const {

    loadStock,
    saveStock,
    getItem,
    addStock,
    removeStock,
    setPrice,
    setAvailability

} = require("../core/stockEngine");

const {

    getOrganization

} = require("../core/organizationEngine");

const MENU_FILE = path.join(
    __dirname,
    "../data/menu.json"
);

module.exports = {

    data: new SlashCommandBuilder()

        .setName("restock")

        .setDescription("Manage cafeteria inventory.")

        .addStringOption(option =>

            option

                .setName("action")

                .setDescription("Management action")

                .setRequired(true)

                .addChoices(

                    {
                        name: "➕ Add Stock",
                        value: "add"
                    },

                    {
                        name: "➖ Remove Stock",
                        value: "remove"
                    },

                    {
                        name: "💰 Change Price",
                        value: "price"
                    },

                    {
                        name: "🚫 Availability",
                        value: "availability"
                    },

                    {
                        name: "🆕 Create Item",
                        value: "new"
                    }

                )

        )

        .addStringOption(option =>

            option

                .setName("category")

                .setDescription("Item category")

                .setRequired(true)

                .setAutocomplete(true)

        )

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Item")

                .setRequired(true)

                .setAutocomplete(true)

        )

        .addIntegerOption(option =>

            option

                .setName("quantity")

                .setDescription("Quantity")

                .setRequired(false)

        )

        .addIntegerOption(option =>

            option

                .setName("price")

                .setDescription("Price")

                .setRequired(false)

        )

        .addBooleanOption(option =>

            option

                .setName("available")

                .setDescription("Availability")

                .setRequired(false)

        )

        .addStringOption(option =>

            option

                .setName("emoji")

                .setDescription("Emoji (for new items)")

                .setRequired(false)

        )

        .addStringOption(option =>

            option

                .setName("display")

                .setDescription("Display name (for new items)")

                .setRequired(false)

        ),

    async autocomplete(interaction) {
                const focused = interaction.options.getFocused(true);

        const stock = loadStock();

        if (focused.name === "category") {

            const categories = [

                "foods",

                "drinks",

                "alcohol",

                "cannabis",

                "cigarettes"

            ];

            return interaction.respond(

                categories.map(category => ({

                    name: category.charAt(0).toUpperCase() + category.slice(1),

                    value: category

                }))

            );

        }

        if (focused.name === "item") {

            const selectedCategory = interaction.options.getString("category");

            if (!selectedCategory || !stock[selectedCategory]) {

                return interaction.respond([]);

            }

            const search = focused.value.toLowerCase();

            const choices = Object.keys(

                stock[selectedCategory]

            )

                .filter(item =>

                    item.includes(search)

                )

                .slice(0, 25)

                .map(item => ({

                    name: item.replace(/_/g, " "),

                    value: item

                }));

            return interaction.respond(choices);

        }

    },

    async execute(interaction) {
                const organization = getOrganization(
            interaction.guild.id
        );

        if (!organization) {

            return interaction.reply({

                content: "❌ No organization has been initialized.",

                ephemeral: true

            });

        }

        if (

            !organization.executiveRole ||

            !interaction.member.roles.cache.has(

                organization.executiveRole

            )

        ) {

            return interaction.reply({

                content: "❌ Only Executives can manage the cafeteria.",

                ephemeral: true

            });

        }

        const action = interaction.options.getString("action");

        const category = interaction.options.getString("category");

        const itemId = interaction.options
            .getString("item")
            .trim()
            .toLowerCase();

        const quantity = interaction.options.getInteger("quantity");

        const price = interaction.options.getInteger("price");

        const available = interaction.options.getBoolean("available");

        const emoji = interaction.options.getString("emoji");

        const display = interaction.options.getString("display");

        const stock = loadStock();

        const menu = JSON.parse(

            fs.readFileSync(

                MENU_FILE,

                "utf8"

            )

        );

        const embed = new EmbedBuilder()

            .setColor(0x2ECC71)

            .setFooter({

                text: `${organization.name} Cafeteria Management`

            })

            .setTimestamp();
                    switch (action) {

            case "add": {

                if (quantity === null) {

                    return interaction.reply({

                        content: "❌ You must specify a quantity to add.",

                        ephemeral: true

                    });

                }

                addStock(

                    category,

                    itemId,

                    quantity,

                    interaction.user.id

                );

                const updated = getItem(category, itemId);

                embed

                    .setTitle("📦 Stock Added")

                    .setDescription(

                        `Added **${quantity}** units to **${itemId.replace(/_/g, " ")}**.`

                    )

                    .addFields(

                        {

                            name: "Current Stock",

                            value: `${updated.stock}`,

                            inline: true

                        }

                    );

                break;

            }

            case "remove": {

                if (quantity === null) {

                    return interaction.reply({

                        content: "❌ You must specify a quantity to remove.",

                        ephemeral: true

                    });

                }

                removeStock(

                    category,

                    itemId,

                    quantity

                );

                const updated = getItem(category, itemId);

                embed

                    .setTitle("📦 Stock Removed")

                    .setDescription(

                        `Removed **${quantity}** units from **${itemId.replace(/_/g, " ")}**.`

                    )

                    .addFields(

                        {

                            name: "Current Stock",

                            value: `${updated.stock}`,

                            inline: true

                        }

                    );

                break;

            }

            case "price": {

                if (price === null) {

                    return interaction.reply({

                        content: "❌ You must specify a new price.",

                        ephemeral: true

                    });

                }

                setPrice(

                    category,

                    itemId,

                    price

                );

                embed

                    .setTitle("💰 Price Updated")

                    .setDescription(

                        `**${itemId.replace(/_/g, " ")}** now costs **₦${price.toLocaleString()}**.`

                    );

                break;

            }

            case "availability": {

                if (available === null) {

                    return interaction.reply({

                        content: "❌ Specify whether the item should be available.",

                        ephemeral: true

                    });

                }

                setAvailability(

                    category,

                    itemId,

                    available

                );

                embed

                    .setTitle("🚦 Availability Updated")

                    .setDescription(

                        available

                            ? `✅ **${itemId.replace(/_/g, " ")}** is now available.`

                            : `❌ **${itemId.replace(/_/g, " ")}** is now out of stock.`

                    );

                break;

            }

            case "new": {

                if (

                    !display ||

                    !emoji ||

                    price === null ||

                    quantity === null

                ) {

                    return interaction.reply({

                        content: "❌ Creating a new item requires display name, emoji, price and quantity.",

                        ephemeral: true

                    });

                }

                if (!menu[category]) {

                    menu[category] = {};

                }

                menu[category][itemId] = {

                    name: display,

                    emoji,

                    price

                };

                fs.writeFileSync(

                    MENU_FILE,

                    JSON.stringify(menu, null, 4)

                );

                addStock(

                    category,

                    itemId,

                    quantity,

                    interaction.user.id

                );

                setPrice(

                    category,

                    itemId,

                    price

                );

                embed

                    .setTitle("🆕 New Menu Item")

                    .setDescription(

                        `${emoji} **${display}** has been added to the cafeteria menu.`

                    );

                break;

            }

        }
                return interaction.reply({

            embeds: [embed]

        });

    }

};
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const {
    getOrganization,
    initializeOrganization
} = require("../core/organizationEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("initialize")

        .setDescription("Initialize this organization's settings.")

        .addStringOption(option =>

            option

                .setName("type")

                .setDescription("Organization type")

                .setRequired(true)

                .addChoices(

                    {
                        name: "Media Company",
                        value: "media"
                    },

                    {
                        name: "Business",
                        value: "business"
                    },

                    {
                        name: "Community",
                        value: "community"
                    }

                )

        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const organization = getOrganization(interaction.guild.id);

        if (!organization) {

            return interaction.reply({

                content:
                    "❌ Create an organization first using **/createorganization**.",

                ephemeral: true

            });

        }

        if (organization.initialized) {

            return interaction.reply({

                content:
                    "⚠️ This organization has already been initialized.",

                ephemeral: true

            });

        }

        initializeOrganization(

            interaction.guild.id,

            {

                organizationType:
                    interaction.options.getString("type")

            }

        );

        const embed = new EmbedBuilder()

            .setColor(0x57F287)

            .setTitle("✅ Organization Initialized")

            .setDescription(

                `**${organization.organizationName}** is now fully initialized.

You can now continue configuring your organization using commands like **/setrole**.`

            )

            .setTimestamp();

        await interaction.reply({

            embeds: [embed]

        });

    }

};
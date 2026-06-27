const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const {
    createOrganization,
    getOrganization
} = require("../core/organizationEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("createorganization")

        .setDescription("Creates a new organization for this server.")

        .addStringOption(option =>

            option

                .setName("name")

                .setDescription("Organization name")

                .setRequired(true)

        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        let organization = getOrganization(interaction.guild.id);

        if (!organization) {

            organization = createOrganization(interaction.guild);

        }

        if (organization.initialized) {

            return interaction.reply({

                content:
                    "❌ This server already has an initialized organization.",

                ephemeral: true

            });

        }

        organization.organizationName =
            interaction.options.getString("name");

        const embed = new EmbedBuilder()

            .setColor(0x00AE86)

            .setTitle("🏢 Organization Created")

            .setDescription(
                `**${organization.organizationName}** has been created successfully.\n\nRun **/initialize** to finish setting up your organization.`
            )

            .setTimestamp();

        await interaction.reply({

            embeds: [embed]

        });

    }

};
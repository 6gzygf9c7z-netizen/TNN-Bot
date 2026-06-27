const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const {
    getOrganization,
    setPermissionRole
} = require("../core/organizationEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setrole")

        .setDescription("Assign a management role to your organization.")

        .addStringOption(option =>

            option

                .setName("permission")

                .setDescription("Permission to configure")

                .setRequired(true)

                .addChoices(

                    {
                        name: "Executive",
                        value: "executiveRole"
                    },

                    {
                        name: "Finance",
                        value: "financeRole"
                    },

                    {
                        name: "Cafeteria",
                        value: "cafeteriaRole"
                    },

                    {
                        name: "Hospital",
                        value: "hospitalRole"
                    },

                    {
                        name: "Security",
                        value: "securityRole"
                    }

                )

        )

        .addRoleOption(option =>

            option

                .setName("role")

                .setDescription("Select the Discord role")

                .setRequired(true)

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

        if (!organization.initialized) {

            return interaction.reply({

                content:
                    "❌ Initialize your organization first using **/initialize**.",

                ephemeral: true

            });

        }

        const permission =
            interaction.options.getString("permission");

        const role =
            interaction.options.getRole("role");

        setPermissionRole(

            interaction.guild.id,

            permission,

            role.id

        );

        const embed = new EmbedBuilder()

            .setColor(0x5865F2)

            .setTitle("✅ Role Assigned")

            .setDescription(

                `**${role.name}** has been assigned as **${permission}**.`

            )

            .setTimestamp();

        await interaction.reply({

            embeds: [embed]

        });

    }

};
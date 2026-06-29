const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const {

    getOrganization,
    saveOrganization

} = require("../core/organizationEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setrole")

        .setDescription("Configure company and effect roles.")

        .setDefaultMemberPermissions(

            PermissionFlagsBits.Administrator

        )

        .addStringOption(option =>

            option

                .setName("type")

                .setDescription("Type of role to configure")

                .setRequired(true)

                .addChoices(

                    {

                        name: "🏢 Company Role",

                        value: "company"

                    },

                    {

                        name: "🍺 Effect Role",

                        value: "effect"

                    }

                )

        )

        .addStringOption(option =>

            option

                .setName("position")

                .setDescription("Company position or effect")

                .setRequired(true)

                .addChoices(

                    {

                        name: "Executive",

                        value: "executive"

                    },

                    {

                        name: "Reporter",

                        value: "reporter"

                    },

                    {

                        name: "Broadcaster",

                        value: "broadcaster"

                    },

                    {

                        name: "Editor",

                        value: "editor"

                    },

                    {

                        name: "Finance",

                        value: "finance"

                    },

                    {

                        name: "Human Resources",

                        value: "hr"

                    },

                    {

                        name: "🍺 Drunk",

                        value: "drunk"

                    },

                    {

                        name: "🌿 High",

                        value: "high"

                    }

                )

        )

        .addRoleOption(option =>

            option

                .setName("discord_role")

                .setDescription("Discord role to link")

                .setRequired(true)

        ),

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

        const type = interaction.options.getString("type");

        const position = interaction.options.getString("position");

        const role = interaction.options.getRole("discord_role");

        if (!organization.roleMappings) {

            organization.roleMappings = {};

        }

        if (!organization.effectRoles) {

            organization.effectRoles = {};

        }

        if (type === "company") {

            organization.roleMappings[position] = role.id;

        } else {

            organization.effectRoles[position] = role.id;

        }

        switch (position) {

            case "executive":

                organization.executiveRole = role.id;

                break;

            case "reporter":

                organization.reporterRole = role.id;

                break;

            case "broadcaster":

                organization.broadcasterRole = role.id;

                break;

            case "editor":

                organization.editorRole = role.id;

                break;

            case "finance":

                organization.financeRole = role.id;

                break;

            case "hr":

                organization.hrRole = role.id;

                break;

            case "drunk":

                organization.drunkRole = role.id;

                break;

            case "high":

                organization.highRole = role.id;

                break;

        }

        saveOrganization(organization);

        const embed = new EmbedBuilder()

            .setColor(0x2ECC71)

            .setTitle("✅ Role Configuration Updated")

            .setDescription(

                `${role} is now linked to **${position.charAt(0).toUpperCase() + position.slice(1)}** (${type}).`

            )

            .addFields(

                {

                    name: "Organization",

                    value: organization.name,

                    inline: true

                },

                {

                    name: "Configuration Type",

                    value: type,

                    inline: true

                }

            )

            .setFooter({

                text: `${organization.name} Administration`

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

}
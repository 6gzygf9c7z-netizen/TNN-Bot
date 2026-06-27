const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const {
    loadOrganization,
    saveOrganization
} = require("../core/organizationEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setrole")
        .setDescription("Link a Discord role to a TNN department.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option
                .setName("department")
                .setDescription("Department name")
                .setRequired(true)
                .addChoices(
                    { name: "Owner", value: "owner" },
                    { name: "CEO", value: "ceo" },
                    { name: "Finance", value: "finance" },
                    { name: "Manager", value: "manager" },
                    { name: "Chef", value: "chef" },
                    { name: "Staff", value: "staff" }
                )
        )
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Discord role")
                .setRequired(true)
        ),

    async execute(interaction) {

        const department = interaction.options.getString("department");
        const role = interaction.options.getRole("role");

        const organization = loadOrganization();

        if (!organization.roles) {
            organization.roles = {};
        }

        organization.roles[department] = role.id;

        saveOrganization(organization);

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("✅ Department Role Linked")
            .setDescription(
                `**${department.toUpperCase()}** is now linked to ${role}.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
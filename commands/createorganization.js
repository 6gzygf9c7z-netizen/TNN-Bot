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
        .setName("createorganization")
        .setDescription("Create your organization.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("Organization name")
                .setRequired(true)
        ),

    async execute(interaction) {

        const organization = loadOrganization();

        if (organization.name) {
            return interaction.reply({
                content: "❌ An organization already exists.",
                ephemeral: true
            });
        }

        const name = interaction.options.getString("name");

        organization.name = name;
        organization.ownerId = interaction.user.id;
        organization.createdAt = Date.now();

        saveOrganization(organization);

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle("🏢 Organization Created")
            .setDescription(
                `**${name}** has been successfully registered.\n\n` +
                `Owner: ${interaction.user}`
            )
            .setFooter({
                text: "TNN Organization System"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
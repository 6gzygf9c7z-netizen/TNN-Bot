const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const {
    loadOrganization,
    saveOrganization
} = require("../core/organizationEngine");

const {
    initializeStock
} = require("../core/inventoryEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Initialize TNN OS for this server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {

        let organization = loadOrganization();

        if (organization.initialized) {
            return interaction.reply({
                content: "⚠️ TNN OS has already been initialized on this server.",
                ephemeral: true
            });
        }

        organization.initialized = true;
        organization.guildId = interaction.guild.id;
        organization.guildName = interaction.guild.name;
        organization.createdAt = Date.now();

        saveOrganization(organization);

        initializeStock();

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("🏢 TNN OS Initialized")
            .setDescription(
                "The TNN operating system has been successfully initialized.\n\n" +
                "**Next Steps:**\n" +
                "• `/createorganization`\n" +
                "• `/setrole`\n\n" +
                "After completing those two steps, your organization will be fully operational."
            )
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getOrCreateAccount,
    saveAccount
} = require("../core/accountsEngine");

const {
    getOrganization
} = require("../core/organizationEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("clearbills")

        .setDescription("Clear an employee's cafeteria debt.")

        .addUserOption(option =>
            option
                .setName("employee")
                .setDescription("Employee whose bills should be cleared.")
                .setRequired(true)
        ),

    async execute(interaction) {

        const guildId = interaction.guild.id;

        const target = interaction.options.getUser("employee");

        const member = interaction.member;

        const organization = getOrganization(guildId);

        if (!organization) {

            return interaction.reply({
                content: "❌ No organization has been initialized yet.",
                ephemeral: true
            });

        }

        if (
            !organization.executiveRole ||
            !member.roles.cache.has(organization.executiveRole)
        ) {

            return interaction.reply({
                content: "❌ Only Executives can clear employee bills.",
                ephemeral: true
            });

        }

        const account = getOrCreateAccount(
            target.id,
            guildId
        );
                account.outstandingBills = 0;
        account.lastBillCleared = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle("✅ Bills Cleared")
            .setDescription(
                `**${target.username}**'s cafeteria bills have been cleared.`
            )
            .addFields(
                {
                    name: "Approved By",
                    value: `${interaction.user}`,
                    inline: true
                },
                {
                    name: "Outstanding Debt",
                    value: "₦0",
                    inline: true
                }
            )
            .setFooter({
                text: `${organization.name} Cafeteria`
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });

    }

};
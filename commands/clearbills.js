const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getAccount,
    clearDebt,
    removeMoney
} = require("../core/accountsEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearbills")
        .setDescription("Pay all your outstanding bills."),

    async execute(interaction) {

        const account = getAccount(interaction.user.id);

        if (!account) {
            return interaction.reply({
                content: "❌ You don't have an account yet.",
                ephemeral: true
            });
        }

        if (account.debt <= 0) {
            return interaction.reply({
                content: "✅ You have no outstanding bills.",
                ephemeral: true
            });
        }

        if (account.wallet < account.debt) {
            return interaction.reply({
                content: `❌ You need ₦${account.debt.toLocaleString()} to clear your bills.`,
                ephemeral: true
            });
        }

        const amountPaid = account.debt;

        removeMoney(interaction.user.id, amountPaid);

        clearDebt(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle("🧾 Bills Cleared")
            .setDescription(
                `You successfully paid **₦${amountPaid.toLocaleString()}** in outstanding bills.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
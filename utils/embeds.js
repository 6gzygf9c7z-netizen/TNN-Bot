const { EmbedBuilder } = require("discord.js");
const organizations = require("../data/organizations.json");

function getOrganization(guildId) {

    return organizations[guildId] || {};

}

function createNotificationEmbed(guildId, data) {

    const organization = getOrganization(guildId);

    const embed = new EmbedBuilder()
        .setColor(organization.color || "#1E3A8A")
        .setTitle(`${data.emoji} ${data.title}`)
        .setDescription(
            data.description || "No details available."
        )
        .setTimestamp();

    if (data.subject) {

        embed.addFields({

            name: "Subject",

            value: data.subject,

            inline: false

        });

    }

    if (data.status) {

        embed.addFields({

            name: "Status",

            value: data.status,

            inline: true

        });

    }

    if (data.details) {

        embed.addFields({

            name: "Details",

            value: data.details,

            inline: false

        });

    }

    if (organization.logo) {

        embed.setThumbnail(organization.logo);

    }

    embed.setFooter({

        text: organization.name || "TNN OS"

    });

    return embed;

}

module.exports = {

    createNotificationEmbed

};
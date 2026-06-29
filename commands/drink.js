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

};
        removeItem(

            guildId,

            userId,

            itemId,

            1

        );

        account.hydration = Math.min(

            100,

            (account.hydration || 100) + 20

        );

        let effectMessage = "💧 Refreshing drink...";

        let emoji = "🥤";

        if (isAlcohol) {

            const intoxicationGain = Math.floor(

                Math.random() * 15

            ) + 10;

            account.intoxication = Math.min(

                100,

                (account.intoxication || 0) + intoxicationGain

            );

            applyEffect(userId, {

                name: "drunk",

                intensity: account.intoxication,

                duration: 30 * 60 * 1000,

                source: itemId

            });

            combineEffects(userId);

            emoji = "🍺";

            if (account.intoxication <= 20) {

                effectMessage = "🙂 You feel slightly tipsy...";

            } else if (account.intoxication <= 40) {

                effectMessage = "🥴 You're beginning to slur your words...";

            } else if (account.intoxication <= 70) {

                effectMessage = "🍻 You're obviously drunk now... everyone can tell.";

            } else {

                effectMessage = "☠️ You're completely wasted... someone should probably take your keys.";

            }

            if (

                organization?.drunkRole &&

                interaction.guild.members.me.roles.highest.position >

                interaction.guild.roles.cache.get(

                    organization.drunkRole

                )?.position

            ) {

                await interaction.member.roles.add(

                    organization.drunkRole

                ).catch(() => {});

            }

        }

        account.updatedAt = Date.now();

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(

                isAlcohol

                    ? 0xE67E22

                    : 0x3498DB

            )

            .setTitle(`${emoji} Drink Consumed`)

            .setDescription(

                `${interaction.user} drank **${drink.name}**.\n\n${effectMessage}`

            )

            .addFields(

                {

                    name: "💧 Hydration",

                    value: `${account.hydration}%`,

                    inline: true

                },

                {

                    name: "🍺 Intoxication",

                    value: `${account.intoxication || 0}%`,

                    inline: true

                }

            )

            .setFooter({

                text: `${organization?.name || "Organization"} Cafeteria`

            })

            .setTimestamp();

        return interaction.reply({

            embeds: [embed]

        });

    }

};
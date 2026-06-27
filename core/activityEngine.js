const activities = new Map();

function recordActivity(userId, guildId, activity) {

    activities.set(userId, {

        userId,

        guildId,

        activity,

        timestamp: Date.now()

    });

}

function getActivity(userId) {

    return activities.get(userId) || null;

}
function getRecentActivities(

    guildId,

    activity = null,

    withinMinutes = 15

) {

    const cutoff =

        Date.now() -

        (withinMinutes * 60 * 1000);

    const recent = [];

    for (const entry of activities.values()) {

        if (entry.guildId !== guildId) {

            continue;

        }

        if (entry.timestamp < cutoff) {

            continue;

        }

        if (

            activity &&

            entry.activity !== activity

        ) {

            continue;

        }

        recent.push(entry);

    }

    return recent;

}
function clearExpiredActivities(

    withinMinutes = 15

) {

    const cutoff =

        Date.now() -

        (withinMinutes * 60 * 1000);

    for (

        const [userId, entry]

        of activities.entries()

    ) {

        if (

            entry.timestamp < cutoff

        ) {

            activities.delete(userId);

        }

    }

}
function getRandomPartner(

    guildId,

    activity,

    excludeUserId

) {

    const candidates =

        getRecentActivities(

            guildId,

            activity

        ).filter(

            entry =>

                entry.userId !== excludeUserId

        );

    if (

        candidates.length === 0

    ) {

        return null;

    }

    return candidates[

        Math.floor(

            Math.random() *

            candidates.length

        )

    ];

}
module.exports = {

    recordActivity,

    getActivity,

    getRecentActivities,

    clearExpiredActivities,

    getRandomPartner

};
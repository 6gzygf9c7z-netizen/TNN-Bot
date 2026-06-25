const fs = require('fs');

module.exports = {
    name: 'status',

    execute(message) {

        const stats = JSON.parse(
            fs.readFileSync('./data/stats.json')
        );

        const userId = message.author.id;

        if (!stats[userId]) {

            stats[userId] = {
                hunger: 100,
                hydration: 100,
                nicotine: 0,
                intoxication: 0,
                energy: 100,
                mood: 50
            };

            fs.writeFileSync(
                './data/stats.json',
                JSON.stringify(stats, null, 2)
            );

        }

        const userStats = stats[userId];

        let state = '🙂 Sober';

        if (userStats.intoxication >= 80) {
            state = '💀 Absolutely Finished';
        } else if (userStats.intoxication >= 60) {
            state = '🤢 Wasted';
        } else if (userStats.intoxication >= 40) {
            state = '🥴 Drunk';
        } else if (userStats.intoxication >= 20) {
            state = '🍺 Tipsy';
        }

        let moodStatus = '😐 Neutral';

        if (userStats.mood >= 90) {
            moodStatus = '🚀 Existing on another plane';
        } else if (userStats.mood >= 75) {
            moodStatus = '😎 Vibing';
        } else if (userStats.mood >= 60) {
            moodStatus = '🙂 Happy';
        } else if (userStats.mood <= 20) {
            moodStatus = '😭 Miserable';
        }

        let event = '';

        if (userStats.intoxication >= 80) {

            const events = [
                '💀 You challenged the office printer to a duel.',
                '💀 You tried unlocking a door that was already open.',
                '💀 You greeted a coat hanger and called it Chief of Staff.',
                '💀 You attempted to negotiate with a vending machine.',
                '💀 You are currently explaining economics to a microwave.',
                '💀 You filed a complaint against gravity.',
                '💀 You attempted to promote a potted plant.'
            ];

            event =
                '\n\n' +
                events[
                    Math.floor(
                        Math.random() * events.length
                    )
                ];
        }

        message.reply(
            `📊 ${message.author.username}'s Status\n\n` +
            `🍔 Hunger: ${userStats.hunger}/100\n` +
            `🥤 Hydration: ${userStats.hydration}/100\n` +
            `🚬 Nicotine: ${userStats.nicotine}/100\n` +
            `🥃 Intoxication: ${userStats.intoxication}/100\n` +
            `😴 Energy: ${userStats.energy}/100\n` +
            `🎉 Mood: ${userStats.mood}/100\n\n` +
            `Status: ${state}\n` +
            `Mood: ${moodStatus}` +
            event
        );

    }
};
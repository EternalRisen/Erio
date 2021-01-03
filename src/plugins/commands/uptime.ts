/*
* uptime command:  returns how long the bot has been up for.
*/

import Discord from 'discord.js';

module.exports = {
    run: async (client: { uptime: number; }, message: Discord.Message, args: string[]) => {
        let totalSeconds = Math.floor(client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        hours = (hours - (days * 24));
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        // TODO:  Make this look better
        const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        message.channel.send(uptime);
    },
    aliases: [],
    description: 'Returns the amount of time the bot has been online.',
    type: 'util',
    usage: 'uptime',
}

'use strict';

import Discord = require('discord.js');

module.exports = {
    run: async (client: any, message: Discord.Message, args: Array<string>) => {
        let totalSeconds = Math.floor(client.uptime / 1000); 
        let days = Math.floor(totalSeconds / 86400); 
        let hours = Math.floor(totalSeconds / 3600); 
        totalSeconds %= 3600; 
        let minutes = Math.floor(totalSeconds / 60); 
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        message.channel.send(uptime);
    },
    aliases: [],
    description: 'Returns the amount of time the bot has been online.',
    type: 'util',
    usage: 'uptime',
}
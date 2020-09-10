'use strict';

import Discord from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: string[]) => {
        if (!client.serverQueue[message.guild!.id] || !client.serverQueue[message.guild!.id].queue) return message.channel.send('There is no queue');

        if (client.serverQueue[message.guild!.id].queue.length === 0) return message.channel.send('there are no songs in the queue.');
        
        if (message.guild?.voice?.connection && message.member?.voice.channel) {
            for (let i = client.serverQueue[message.guild!.id].queue.length -1; i>=0; i--) {
                client.serverQueue[message.guild!.id].queue.splice(i, 1);
            }
            message.guild.voice.connection.disconnect();
        } else {
            message.channel.send('huh?');
        }
    },
    aliases: [],
    description: 'Drains the queue and leaves',
    type: 'fun',
    usage: 'stop'
}
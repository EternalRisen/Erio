/*
* skip command:  skips the currently playing song
*/

import Discord from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: string[]) => {
        //return message.reply('this command is disabled right now...');
        if (client.serverQueue[message.guild!.id].dispatcher) {
            client.serverQueue[message.guild!.id].dispatcher.end();
        } else {
            message.channel.send('what are you trying to skip?');
        }
    },
    aliases: ['s'],
    description: 'Skips a song in the queue',
    type: 'fun',
    usage: 'skip'
}

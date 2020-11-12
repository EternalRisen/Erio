/*
* queue command:  returns the queue list for the server
*/

import { Message } from "discord.js";
import ytdl from 'ytdl-core';

module.exports = {
    run: async (client: any, message: Message, args: string[]) => {
        //return message.reply('this command is disabled right now...');
        let items = 'Current Queue:\n'
        let num;

        if (!client.serverQueue[message.guild!.id] || !client.serverQueue[message.guild!.id].queue) return message.channel.send('There is no queue')

        if (client.serverQueue[message.guild!.id].queue.length === 0) return message.channel.send('there are no songs in the queue.');

        if (client.serverQueue[message.guild!.id].queue.length > 10) {
            num = 10
        } else {
            num = client.serverQueue[message.guild!.id].queue.length;
        }

        for (let i = 0; i < num; i++) {
            let j = i + 1;
            const songInfo = await ytdl.getInfo(`${client.serverQueue[message.guild!.id].queue[i]}`);
            items += `\n${j}:  ${songInfo.videoDetails.title}`;
        }
        message.channel.send(`Current Queue (showing only first 10):${items}`);
        message.channel.send(`Total queue length is ${client.serverQueue[message.guild!.id].queue.length}`);
    },
    aliases: ['q'],
    description: 'Displays the song queue',
    type: 'fun',
    usage: 'queue'
}

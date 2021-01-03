/*
* set-log command:  sets the modlog channel for the server
*/

import Discord from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: string[]) => {
        if (!message.member?.permissions.has(['ADMINISTRATOR'])) return;
        try {
            await client.pool.query('SELECT * FROM servers WHERE serverid = $1', [message.guild?.id]);
        } catch {
            return message.reply('there is no active database, so I cannot do this task.');
        }
        let channelid = args[0];
        try {
            channelid = channelid.replace('<#', '');
            channelid = channelid.replace('>', '');
        } catch {
            // do nothing
        }
        let channel: Discord.GuildChannel | undefined;
        try {
            channel = message.guild?.channels.cache.find(c => c.id === channelid);
        } catch {
            return message.reply('Unable to find the channel.');
        }

        if (!channel || channel === undefined) {
            return message.reply('Unable to find the channel.');
        }

        try {
            await client.pool.query('UPDATE servers SET modlog = $1 WHERE serverid = $2', [channelid, message.guild?.id]);
        } catch {
            return message.channel.send('There was an error with updating the log channel');
        }

        client.serverCache[(message.guild?.id as string)].modlog = channelid;

        message.channel.send(`Set ${channel} as the modlog!`);
    },
    aliases: ['log', 'setlog'],
    description: 'updates the log channel',
    usage: 'set-log <channel | channel-id>',
    type: 'mod',
}

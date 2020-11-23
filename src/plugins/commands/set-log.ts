/*
* set-log command:  sets the modlog channel for the server
*/

import Discord from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: string[]) => {
        if (!message.member?.permissions.has(['ADMINISTRATOR'])) return;
        let channelid = args[0];
        try {
            channelid = channelid.replace('<#', '');
            channelid = channelid.replace('>', '');
        } catch {
            // do nothing
        }
        let channel: Discord.GuildChannel | undefined;
        try {
            channel = await message.guild?.channels.cache.find(c => c.id === channelid);
        } catch {
            return message.reply('Unable to find the channel.');
        }

        if (!channel || channel === undefined) {
            return message.reply('Unable to find the channel.');
        }

        try {
            await client.pool.query('UPDATE servers SET modlog = $1 WHERE serverid = $2', [channelid, message.guild?.id]);
        } catch {
            return message.channel.send('There was an error with updating the roles');
        }

        message.channel.send(`Set ${channel} as the modlog!`);
    },
    aliases: ['log', 'setlog'],
    description: 'assignes the mute role to bot\'s list of mute roles',
    usage: 'mute-role <role-id>',
    type: 'mod',
}

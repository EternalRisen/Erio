/*
* server-info command:  returns basic information about the server
*/

import Discord from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: string[]) => {
        if (!message.guild) return;

        const embed = new Discord.MessageEmbed().setAuthor('Server Info', `${message.guild?.iconURL()?.replace('webp', message.guild?.icon?.startsWith('a_') ? 'gif': 'png')}`)/* add counts of roles, etc */.addFields([
            {
                name: 'Member Count:',
                value: `${message.guild?.members.cache.size}`,
            },
            {
                name: 'Channel Count:',
                value: `${message.guild?.channels.cache.size}`,
            },
            {
                name: 'Role Count:',
                value: `${message.guild?.roles.cache.size}`,
            },
            {
                name: 'Emoji Count:',
                value: `${message.guild?.emojis.cache.size}`,
            }
        ])/* add additional information */.addFields([
            {
                name: 'Guild Owner',
                value: `${message.guild?.owner}`,
            },
            {
                name: 'Guild Name',
                value: `${message.guild?.name}`,
            },
            {
                name: 'Guild Description',
                value: `${message.guild?.description || 'No description provided', `${message.guild.createdAt.toUTCString()}`}`,
            },
            {
                name: 'Guild afk channel & timeout',
                value: `${message.guild?.afkChannel || 'No AFK channel'}, ${message.guild?.afkTimeout || 'null'}`,
            },
        ]);

        message.channel.send(embed);
    },
    aliases: ['info'],
    description: 'just provides information of the server',
    usage: 'server-info',
    type: 'util',
}

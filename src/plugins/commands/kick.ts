'use string';

import Discord from 'discord.js';

module.exports = {
    run: async (client: Discord.Client, message: Discord.Message, args: string[]) => {
        if (!message.member?.permissions.has(['KICK_MEMBERS', 'MANAGE_GUILD', 'ADMINISTRATOR'])) return;
        let userID = args[0];
        try {
            userID = userID.replace('<', '');
            userID = userID.replace('@', '');
            userID = userID.replace('!', '');
            userID = userID.replace('>', '');
        } catch (e) {
            console.log('owo');
        }
        let member;
        try {
            member = await message.guild?.members.cache.find(u => u.id === userID);
        } catch (e) {
            return message.channel.send(`member ${member} was not found.`)
        }
        if (member?.kickable) {
            try {
                member.kick();
                message.channel.send(`Member ${(member as unknown as Discord.User).tag}(${(member as unknown as Discord.User).id}) has been kicked`);
            } catch (e) {
                message.channel.send(`There was a problem with your request:  ${e.message}`);
            }
        } else {
            return message.reply('I\'m Probably lacking the permissions to kick this user or they are too high up in the hierarchy');
        }
    },
    aliases: ['k'],
    description: 'Kicks members',
    type: 'mod',
    usage: 'kick <member>'
}
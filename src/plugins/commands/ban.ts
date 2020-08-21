'use string';

import Discord from 'discord.js';

module.exports = {
    run: async (client: Discord.Client, message: Discord.Message, args: string[]) => {
        if (!message.member?.permissions.has(['BAN_MEMBERS', 'MANAGE_GUILD', 'ADMINISTRATOR'])) return;
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
        if (member?.bannable) {
            try {
                member.ban();
                message.channel.send(`Member ${(member as unknown as Discord.User).tag}(${(member as unknown as Discord.User).id}) has been banned`);
            } catch (e) {
                message.channel.send(`There was a problem with your request:  ${e.message}`);
            }
        } else {
            return message.reply('I\'m Probably lacking the permissions to ban this user or they are too high up in the hierarchy');
        }
    },
    aliases: ['b'],
    description: 'Bans members',
    type: 'mod',
    usage: 'ban <member>'
}
/*
* kick command:  kicks a user
*/

import Discord, { GuildMember, User } from 'discord.js';

module.exports = {
    run: async (client: Discord.Client, message: Discord.Message, args: string[]) => {
        if (!message.member?.permissions.has(['KICK_MEMBERS']) || !message.member?.permissions.has(['BAN_MEMBERS']) || !message.member?.permissions.has(['ADMINISTRATOR'])) return;
        let userID = args[0];
        let rsn = args[1];
        if (rsn === '') {
            rsn = 'No reason specified.'
        }
        try {
            userID = userID.replace('<', '');
            userID = userID.replace('@', '');
            userID = userID.replace('!', '');
            userID = userID.replace('>', '');
        } catch (e) {
            console.log('owo');
        }
        let member: Discord.GuildMember | undefined;
        let rejectionReason = '';

        function permCheck() {
            try {
                if (message.member?.id === message.guild?.ownerID) {
                    return false;
                } else if ((member as GuildMember).roles.highest.rawPosition >= message.member!.roles.highest.rawPosition) {
                    rejectionReason = 'The user is either a higher up or is the same authority level as you.';
                    return true;
                } else if (member?.id === message.guild?.ownerID) {
                    rejectionReason = 'You can\'t kick the owner';
                    return true;
                }
            } catch (e) {
                console.error(e);
            }
        }

        try {
            member = message.guild?.members.cache.find(u => u.id === userID);
        } catch (e) {
            return message.channel.send(`member ${member} was not found.`)
        }
        
        try {
            if (permCheck()) return message.reply(rejectionReason);
            member?.kick();
            message.channel.send(`Member ${member} has been kicked`);
            (member as unknown as User).send(`You have been banned from ${message.guild} for the following reason:  ${rsn}`)
        } catch (e) {
            message.channel.send(`There was a problem with your request:  ${e.message}`);
        }
    },
    aliases: ['k'],
    description: 'Kicks members',
    type: 'mod',
    usage: 'kick <member>'
}

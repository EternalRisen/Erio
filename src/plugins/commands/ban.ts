/*
* ban command:  bans a user.
*/

import Discord, { GuildMember } from 'discord.js';

module.exports = {
    run: async (client: Discord.Client, message: Discord.Message, args: string[]) => {
        if (!message.member?.permissions.has(['BAN_MEMBERS']) || !message.member?.permissions.has(['MANAGE_GUILD']) || !message.member?.permissions.has(['ADMINISTRATOR'])) return;
        let userID = args[0];
        let rsn = args[1];
        let err;
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
        let guildMember: Discord.GuildMember | Discord.User | undefined;
        let rejectionReason;
        // message.guild?.members.cache.find(u => u.id === userID)?.roles.highest.rawPosition
        // message.member.roles.highest.rawPosition;
        try {
            guildMember = await message.guild?.members.cache.find(u => u.id === userID);
        } catch (e) {
            console.log('idk');
        }

        function permCheck() {
            try {
                if (message.member?.id === message.guild?.ownerID) {
                    return false;
                } else if ((guildMember as GuildMember).roles.highest.rawPosition >= message.member!.roles.highest.rawPosition) {
                    rejectionReason = 'The user is either a higher up or is the same authority level as you.';
                    return true;
                } else if (guildMember?.id === message.guild?.ownerID) {
                    rejectionReason = 'You can\'t ban the owner';
                    return true;
                }
            } catch (e) {
                err = e;
            }
        }

        try {
            if (permCheck()) return message.reply(rejectionReason);
            guildMember = await client.users.fetch(userID);
            try {
                message.guild?.members.ban(guildMember);
            } catch (e) {
                throw new Error(e);
            }
            message.channel.send(`member ${guildMember} has been banned`);
            guildMember.send(`You have been banned from ${message.guild} for the following reason:  ${rsn}`);
        } catch (e) {
            err = e;
            return message.channel.send(`There was a problem processing this request.  ${err}`);
        }
    },
    aliases: ['b'],
    description: 'Bans members',
    type: 'mod',
    usage: 'ban <member>'
}

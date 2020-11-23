/*
* unban command:  unbans a user
*/

import Discord from 'discord.js'

module.exports = {
    run: async (client: Discord.Client, message: Discord.Message, args: string[]) => {
        if (!message.member?.permissions.has(['BAN_MEMBERS']) || !message.member?.permissions.has(['ADMINISTRATOR'])) return;
        let userID = args[0];
        let rsn = args[1];

        if (rsn === '') {
            rsn = 'No reason specified.'
        }

        // Some retarded ass check that I have to fucking do bc fuck you discord 🖕🖕🖕
        async function checkBans() {
            try {
                let member = await message.guild?.members.cache.find(u => u.id === userID);
                if (userID === message.guild?.ownerID) { return false; }
                if (member!.id === userID) { return false; } else {return true;}
            } catch (e) {
                return true;
            }
        }

        const banned = checkBans();

        try {
            let guildMember = await client.users.fetch(userID);
            if (await banned === false) return message.reply('this user is not banned.');
            message.guild?.members.unban(guildMember);
            message.channel.send(`member ${guildMember} has been unbanned`);
            guildMember.send(`you have been unbanned from ${message.guild} for the following reason:  ${rsn}`)
        } catch (e) {
            return message.channel.send(`There was a problem processing this request.  ${e.message}`);
        }
    },
    aliases: [],
    description: 'Unbans a member',
    type: 'mod',
    usage: 'unban <member>'
}

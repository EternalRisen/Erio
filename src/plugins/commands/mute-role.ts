/*
* mute-role command:  assigns the servers mute role for the server
*/

import Discord from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: string[]) => {
        let roleid = args[0];
        console.log(roleid)
        try {
            roleid = roleid.replace('<@&', '');
            roleid = roleid.replace('>', '');
        } catch {
            // do nothing
        }
        console.log(roleid);
        let role: Discord.Role | undefined;
        try {
            role = await message.guild?.roles.cache.find(r => r.id === roleid);
            console.log('found!')
        } catch {
            console.log('not found');
            return message.reply('Unable to find the role.');
        }

        if (!role || role === undefined) {
            return message.reply('Unable to find the role.')
        }

        try {
            await client.pool.query('UPDATE servers SET muterole = $1 WHERE serverid = $2', [roleid, message.guild?.id]);
        } catch {
            return message.channel.send('There was an error with updating the roles');
        }

        message.channel.send(`Set ${role} as the mute role!`);
    },
    aliases: ['mrole', 'role-mute', 'set-mute'],
    description: 'assignes the mute role to bot\'s list of mute roles',
    usage: 'mute-role <role-id>',
    type: 'mod',
}

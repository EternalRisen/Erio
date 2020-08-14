/*
* delete command:  deletes specific messages by the provided ID.  (very redundant command, but who gives a shit.)
*/

'use strict';

// Require this shit
import Discord from 'discord.js';

module.exports = {
    run: async (client: Discord.Client, message: Discord.Message, args: Array<string>) => {
        args = args.join(' ').split(',');
        if (!message.member?.permissions.has(['MANAGE_MESSAGES', 'ADMINISTRATOR'])) return;
        for (let arg of args) {
            try {
                let msg = await (client.channels.cache.get(`${message.channel.id}`) as any).messages.fetch(`${arg}`);
                msg.delete();
            } catch (e) {
                message.reply(`Message ID ${arg} seems to not exist(make sure it's 18 characters that *are* numbers), Or I am lacking permissions to delete messages`);
            }
        }
    },
    aliases: ['del'],
    description: 'Deletes specific messages (requires giving the message ID)',
    type: 'mod',
    usage: 'delete <msgID>, <msgID>, ...'
}


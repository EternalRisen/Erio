'use strict';

import Discord from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: Array<string>) => {
        if (!message.member?.permissions.has(['MANAGE_MESSAGES', 'ADMINISTRATOR'])) return;
        let num = parseInt(args[0]);
        let authID = message.author.id;
        let deleted = false;
        if (num > 25) {
            message.channel.send('Do you want to delete this many messages[y/n]?');
            (async function () {
                await client.on('message', (msg: Discord.Message) => {
                    if (msg.content === 'y' && msg.author.id === authID && deleted === false) {
                        (async function () {
                            message.channel.send(`deleting ${num} messages...`);
                            await message.channel.bulkDelete(num);
                            message.channel.send(`Successfully deleted ${num} messages!`);
                            deleted = true;
                        })();
                    } else if (msg.content === 'n' && deleted === false) {
                        message.channel.send('Cancelling...');
                        deleted = true;
                    }
                });
            })();
        } else {
            await message.channel.bulkDelete(num);
            message.channel.send(`Successfully deleted ${num} messages(s)!`)
        }
    },
    aliases: ['clear'],
    description: 'mass deletes messages',
    type: 'mod',
    usage: 'purge <num>'
}
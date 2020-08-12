'use strict';

import Discord from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: Array<string>) => {
        if (!message.member?.permissions.has(['MANAGE_MESSAGES', 'ADMINISTRATOR'])) return;
        let num = parseInt(args[0]);
        let authID = message.author.id;
        let isComplete = false;
        if (num > 25) {
            message.channel.send('Do you want to delete this many messages[y/n]?');
            (async function () {
                await client.on('message', (msg: Discord.Message) => {
                    if (isComplete) return;
                    if (msg.content === 'y' && msg.author.id === authID) {
                        (async function () {
                            message.channel.send(`Deleting ${num} messages...`);
                            try {
                                await message.channel.bulkDelete(num);
                                message.channel.send(`Successfully deleted ${num} message(s)!`);
                            } catch (e) {
                                message.channel.send(`There was an error with your request:\n${e.message}`);
                            }
                        })();
                    } else if (msg.content === 'n') {
                        message.channel.send('Cancelling...');
                    }
                });
            })();
        } else {
            message.channel.send(`Deleting ${num} messages...`);
            try {
                await message.channel.bulkDelete(num);
                message.channel.send(`Successfully deleted ${num} message(s)!`);
            } catch (e) {
                message.channel.send(`There was an error with your request:\n${e.message}`);
            }
        }
    },
    aliases: ['clear'],
    description: 'mass deletes messages',
    type: 'mod',
    usage: 'purge <num>'
}
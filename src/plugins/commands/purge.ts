/*
* purge command:  Just does a mass deletion of messages based on the number you want to delete (any at or above 25 will prompt a confirmation)
*/

'use strict';

import Discord from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: Array<string>) => {
        if (!message.member?.permissions.has(['MANAGE_MESSAGES', 'ADMINISTRATOR'])) return;
        let num = parseInt(args[0]);
        let authID = message.author.id;
        // Yes, This will be required, we don't need dumbasses mass deleting a bunch of stuff by accident
        if (num > 24) {
            message.channel.send('Do you want to delete this many messages[y/n]?');
            let conf = false;
            let del = false;
            const filter = (m: any) => m.content;
            const collector = message.channel.createMessageCollector(filter, { time: 15000 });
            collector.on('collect', m => {
                if (m.author !== message.author) return;
                console.log(m.content);
                if (conf === true) {
                    message.reply('baka, you\'ve already given your answer');
                    return;
                }
                if (m.content === 'y' || m.content === 'yes') {
                    conf = true;
                    del = true;
                } else if (m.content === 'n' || m.content === 'no') {
                    conf = true;
                } else {
                    message.channel.send('baka, this isn\'t a valid answer');
                }
            });
            collector.on('end', () => {
                if (conf === true && del === true) {
                    try {
                        (async function () {
                            await message.channel.bulkDelete(num);
                        })();
                        message.channel.send(`Deleted ${num} messages!`);
                    } catch (e) {
                        message.channel.send(`There was an error with your request.  ${e.message}`);
                    }
                }
                if (conf === true && del === false) {
                    message.channel.send('Canelling...');
                }
                if (conf === false) {
                    message.channel.send('hahahahaha, you too too long!\nTry again');
                }
            });
        } else {
            message.channel.send(`Deleting ${num} messages...`);
            try {
                await message.channel.bulkDelete(num);
                message.channel.send(`Deleted ${num} messages!`);
            } catch (e) {
                message.channel.send(`There was an error with your request.  ${e.message}`);
            }
        }
    },
    aliases: ['clear'],
    description: 'mass deletes messages',
    type: 'mod',
    usage: 'purge <num>'
}
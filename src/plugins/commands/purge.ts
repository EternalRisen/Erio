/*
* purge command:  Just does a mass deletion of messages based on the number you want to delete (any at or above 25 will prompt a confirmation)
*/

import Discord, { TextChannel, NewsChannel } from 'discord.js';

module.exports = {
    run: async (client: any, message: Discord.Message, args: string[]) => {
        if (!message.member?.permissions.has(['MANAGE_MESSAGES']) || !message.member?.permissions.has(['MANAGE_GUILD']) || !message.member?.permissions.has(['ADMINISTRATOR'])) return;
        const num = parseInt(args[0]);
        if (num < 2) return message.reply('I can\'t delete only 1 message.');
        if (num > 100) return message.reply('Discord is retarded so I can only delete a maximum of 100 messages.');
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
                        (async () => {
                            if (message.channel.type === 'dm') throw new Error('This is a Direct Message Channel.');
                            await (message.channel as TextChannel | NewsChannel).bulkDelete(num);
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
                if (message.channel.type === 'dm') throw new Error('This is a Direct Message Channel.');
                await (message.channel as TextChannel | NewsChannel).bulkDelete(num);
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

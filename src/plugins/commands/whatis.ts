'use strict';

import Discord from 'discord.js';

module.exports = {
    run: async (client: Discord.Client, message: Discord.Message, args: Array<string>) => {
        let whatisBase = [
            {
                name: 'love',
                desc: 'I don\'t fucking know'
            },
            {
                name: 'sleep',
                desc: `Something JD-san doesn't get enough of`
            },
            {
                name: 'fluffie',
                desc: 'Someone who loves Wooloos and Mareeps.  ~~and makes bad jokes~~ :P'
            },
            {
                name: 'jd',
                desc: 'My Creator *uwu*'
            },
            {
                name: 'reffrey',
                desc: 'A a spongebob meme fan'
            }
        ];

        if (args.length === 0) {
            return message.reply('I need a term!');
        }
        
        if (args.length > 1) {
            return message.reply('Only one term!');
        }

        let term = args[0];
        let wordFound = false;
        let returnStatement = '';

        for (let whatis of whatisBase) {
            if (whatis.name === term.toLowerCase()) {
                wordFound = true;
                returnStatement += `${whatis.name}: ${whatis.desc}`;
            }
        }

        if (wordFound === false) {
            return message.channel.send(`${term}:  Nothing Appropriate`);
        } else {
            return message.channel.send(returnStatement)
        }
    },
    aliases: [],
    description: 'runs through a wordbase and returns a description if the word is found',
    usage: 'whatis <term>',
    type: 'fun'
}
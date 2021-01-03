/*
* whatis command:  just goes through the "whatisBase" for a match, else just respond with the given term followed by "nothing appropriate"
*/

import Discord from 'discord.js';

module.exports = {
    run: async (client: Discord.Client, message: Discord.Message, args: string[]) => {
        // TODO:  Add more shit
        const whatisBase = [
            {
                name: 'love',
                desc: 'I don\'t fucking know'
            },
            {
                name: 'sleep',
                desc: `Something JD-san doesn't get enough of`
            },
            {
                name: 'jd',
                desc: 'My Creator *uwu*'
            },
            {
                name: 'music',
                desc: 'Something I play *uwu*\nLet\'s Jam :3  (the commands are disabled right now though...)'
            }
        ];

        if (args.length === 0) {
            return message.reply('I need a term!');
        }
        
        if (args.length > 1) {
            return message.reply('Only one term!');
        }

        const term = args[0];
        let wordFound = false;
        let returnStatement = '';

        for (const whatis of whatisBase) {
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

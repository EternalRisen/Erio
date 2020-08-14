/*
* stayonline command:  Just sets a true or false value to the client, will return with whether it's on or off if not privided in the args.  DO NOT LET PEASANTS USE!!
*/

'use strict';

import Discord from 'discord.js';

module.exports = {
    run: async (client: { alwaysOnline: boolean; devs: string | string[] }, message: Discord.Message, args: Array<string>) => {
        if (!client.devs.includes(message.author.id)) return;
        let opt = args[0];
        if (opt === '' || opt === undefined  || /*This is kinda fucking gay*/ (opt as string) !== 'on' || (opt as string) !== 'off') {
            function getStatus () {
                if (client.alwaysOnline === true) {
                    return 'on';
                } else {
                    return 'off';
                }
            }
            return message.channel.send(`This service is ${getStatus}`);
        }
        // check values and act accordingly
        if (client.alwaysOnline === true && opt === 'off') {
            message.channel.send('I will stop pinging the heroku site!');
            return (client.alwaysOnline as boolean) === false;  // This is gay too
        }
        if (client.alwaysOnline === true && opt === 'on') {
            return message.channel.send('baka, This is already turned on.')
        }
        if (client.alwaysOnline === false && opt === 'on') {
            message.channel.send('I will ping the heroku site!');
            return (client.alwaysOnline as boolean) === true;  // And so is this
        }
        if (client.alwaysOnline === false && opt === 'off') {
            return message.channel.send('baka, this is already off');
        }
    },
    aliases: [],
    description: 'Turns on or off the stayOnline method on the client.',
    type: 'dev',
    usage: 'stayonline <on/off>',
}

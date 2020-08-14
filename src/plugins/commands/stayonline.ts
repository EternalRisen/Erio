/*
* stayonline command:  Just sets a true or false value to the client, will return with whether it's on or off if not privided in the args.  DO NOT LET PEASANTS USE!!
*/

'use strict';

import Discord from 'discord.js';

module.exports = {
    run: async (client: { alwaysOnline: boolean; devs: string | string[] }, message: Discord.Message, args: Array<string>) => {
        if (!client.devs.includes(message.author.id)) return;
        let opt = args[0];
        switch (opt) {
            case 'on':
                if (client.alwaysOnline === true) {
                    message.channel.send('baka, This is already turned on.');
                } else {
                    message.channel.send('I will start pinging the heroku site!');
                    (client.alwaysOnline as boolean) = true;
                }
            break;
            case 'off':
                if (client.alwaysOnline === false) {
                    message.channel.send('baka, This is already turned off');
                } else {
                    message.channel.send('I will stop pinging the heroku site!');
                    (client.alwaysOnline as boolean) = false;
                }
            break;
            default:
                function getStatus () {
                    if (client.alwaysOnline === true) {
                        return 'on';
                    } else {
                        return 'off';
                    }
                }
                message.channel.send(`This service is ${getStatus()}`)
            break;
        }
    },
    aliases: [],
    description: 'Turns on or off the stayOnline method on the client.',
    type: 'dev',
    usage: 'stayonline <on/off>',
}

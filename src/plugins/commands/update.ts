'use strict';

import Discord from 'discord.js';
import { stringify } from 'querystring';

module.exports = {
    run: async (client: { devs: string | string[]; }, message: Discord.Message, args: string[]) => {
        // TODO:  Add suport for forcing a pull if fails (usually with heroku failing a git pull)
        if (!client.devs.includes(message.author.id)) return;
        await require('child_process').exec(`git pull --rebase ${process.env.GITREPO || 'https://github.com/yaboijd/erio'}`, {stdio: 'inherit'}, (stderr: string, stdout: string) => {
            message.channel.send(`Update status:\n${stdout}\n${stderr}`)
        });
    },
    aliases: [],
    description: 'runs a git pull to update the local files',
    type: 'dev',
    usage: 'update',
}
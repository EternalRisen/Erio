/*
* update command:  gets any updates from the github repository provided either from GITREPO from the .env file, or from the default repo (YaBoiJD/Erio)
*/

'use strict';

import Discord from 'discord.js';

module.exports = {
    run: async (client: { devs: string | string[]; }, message: Discord.Message, args: string[]) => {
        if (!client.devs.includes(message.author.id)) return;
        await require('child_process').exec(`git --rebase pull ${process.env.GITREPO || 'https://github.com/yaboijd/erio'}`, {stdio: 'inherit'}, (stderr: string, stdout: string) => {
            message.channel.send(`Update status:\n${stdout}\n${stderr}`)
        });
    },
    aliases: [],
    description: 'runs a git pull to update the local files',
    type: 'dev',
    usage: 'update',
}
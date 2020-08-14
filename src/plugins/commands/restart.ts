/*
* restart command:  just restarts the bot.
*/

'use strict';

import Discord = require('discord.js');

const { exec } = require('child_process');

module.exports = {
	run: async (client: { devs: string | string[]; users: { fetch: (arg0: any) => Promise<Discord.User>; }; user: { username: any; }; }, message: Discord.Message, args: Array<string>) => {
		// TODO:  Add Heroku restart support
		if (client.devs.includes(message.author.id)) {
			// TODO: Change this to send to the dump area
			for (const dev of client.devs) {
				client.users.fetch(dev).then((user: Discord.User) => {
					user.send(`${client.user.username} is being restarted by ${message.author.tag}(${message.author.id})`);
				});
			}

			exec('npm start');

			setTimeout(() => {
				process.exit();
			}, 20000);
		}
		else {
			return;
		}
	},
	aliases: [],
	description: 'Restarts the bot.(Operators only.)',
	type: 'dev',
	usage: 'restart',
};

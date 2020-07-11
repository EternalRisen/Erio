'use strict';

import Discord = require('discord.js');

const { exec } = require('child_process');

module.exports = {
	run: async (client: any, message: Discord.Message, args: Array<string>) => {
		// TODO:  Add Heroku restart support
		if (client.devs.includes(message.author.id)) {
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

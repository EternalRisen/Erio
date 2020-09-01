/*
* restart command:  just restarts the bot.
*/

'use strict';

import Discord = require('discord.js');

const { exec } = require('child_process');

module.exports = {
	run: async (client: any, message: Discord.Message, args: Array<string>) => {
		if (client.devs.includes(message.author.id)) {
			let logChannel = await client.channels.cache.get((process.env.BOTLOG as string));
			(logChannel as Discord.TextChannel).send(`${client.user.username} is being restarted by ${message.author.tag}(${message.author.id})`)

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

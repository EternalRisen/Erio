'use strict';

import Discord = require('discord.js');

const { exec } = require('child_process');

module.exports = {
	run: async (client: any, message: Discord.Message, args: Array<string>) => {
		if (client.devs.includes(message.author.id)) {
			const cmd = args.join(' ');
			/* eslint-disable */
			exec(cmd, (stderr: string, stdout: string) => {
				/* eslint-enable */
				message.channel.send((`${stdout}`));
			});
		}
		else {
			return;
		}
	},
	aliases: [],
	description: 'Runs bash command if the user is an operator.(operators only)',
	type: 'dev',
	usage: 'shell <command>',
};

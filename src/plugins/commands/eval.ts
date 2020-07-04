'use strict';

import Discord = require('discord.js');

const { inspect } = require('util');

module.exports = {
	run: async (client: any, message: Discord.Message, args: Array<string>) => {
		if (client.devs.includes(message.author.id)) {
			let evaled;
			try {
				evaled = eval(args.join(' ').slice());
				message.channel.send(inspect(evaled));
			}
			catch (err) {
				message.channel.send(`${err.message}`);
			}
		}
		else {
			return;
		}
	},
	aliases: ['e'],
	description: 'Runs a console eval if the user is an operator.(operators only)',
	type: 'dev',
	usage: 'eval <code>',
};

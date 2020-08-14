/*
* eval command:  runs code provides after initializing the command.  DO NOT LET PEASANTS USE
*/

'use strict';

import Discord = require('discord.js');

const { inspect } = require('util');

module.exports = {
	run: async (client: { devs: string | string[]; }, message: Discord.Message, args: Array<string>) => {
		if (client.devs.includes(message.author.id)) {
			let evaled;
			try {
				evaled = eval(args.join(' ').slice());
				evaled = inspect(evaled);
				// Send as multiple messages in chunks if it's bigger than what discord allows because discord is gay
				if (evaled.length > 1800) {
					const evalChunks: string[] = [];
					for (let i = 0, charsLength = evaled.length; i < charsLength; i += 1800) {
    					evalChunks.push(evaled.substring(i, i + 1800));
					}
					for (let evals of evalChunks) {
						message.channel.send(`\`\`\`js\n${evals}\`\`\``);
					}
				} else {
					message.channel.send(`\`\`\`js\n${evaled}\`\`\``);
				}
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

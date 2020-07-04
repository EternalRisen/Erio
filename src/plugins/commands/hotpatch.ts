'use strict';

import Discord = require('discord.js');

const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require('../../structs/validate');

module.exports = {
    run: async (client: any, message: Discord.Message, args: Array<string>) => {
		if (client.devs.includes(message.author.id)) {
			const hotpatchChoice = args[0];
			if (hotpatchChoice.toLowerCase() === 'commands') {
				console.log('Hotpatching Commands...');
				client.commands.clear();
				client.commands = new Map();
				const files = await fs.readdir(path.join(__dirname, '../../plugins/commands'));
				for (const file of files) {
					delete require.cache[require.resolve(`../../plugins/commands/${file}`)];
					if (file.endsWith('.js')) {
						try {
							const cmdName = file.substring(0, file.indexOf('.js'));
							const cmdModule = require(path.join(__dirname, '../../plugins/commands', file));
							if (checkCommandModule(cmdName, cmdModule)) {
								if (checkProperties(cmdName, cmdModule)) {
									const { aliases } = cmdModule;
									client.commands.set(cmdName, cmdModule);
									if(aliases.length !== 0) {
										aliases.forEach((alias: string) => client.commands.set(alias, cmdModule));
									}
									console.log(`Command loaded:  ${cmdName}:  ${cmdModule.description}`);
								}
							}
						}
						catch (err) {
							console.log(err);
						}
					}
				}
				message.reply('Commands have been hotpatched. :thumbsup:');
			}
		}
		else {
			return;
		}
	},
	aliases: [],
	description: 'Hotpatches Events(TODO) and Commands.(Operators only)',
	type: 'dev',
	usage: 'hotpatch <commands/events>',
};

'use strict';
const { isOperator } = require('../../structs/verification.js');
const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require('../../structs/validate.js');

module.exports = {
	/* eslint-disable */
    run: async (client, message, args) => {
        /* eslint-enable */
		if (isOperator(message.author.id)) {
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
										aliases.forEach(alias => client.commands.set(alias, cmdModule));
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
	description: 'Hotpatches Events(TODO) and Commands.',
};

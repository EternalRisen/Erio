/*
* hotpatch command:  deletes the cached commands from the Map and from the require cache, rebuilds them, and reloads them.  
* All processes will stop during this.  DO NOT LET PEASANTS USE THIS!!
*/

'use strict';

import Discord = require('discord.js');
import { Key } from 'react';

const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require('../../structs/validate');

module.exports = {
    run: async (client: { devs: string | string[]; commands: Map<Key, string>; }, message: Discord.Message, args: Array<string>) => {
		if (client.devs.includes(message.author.id)) {
			const hotpatchChoice = args[0];
			if (hotpatchChoice.toLowerCase() === 'commands') {
				require('child_process').execSync('npx sucrase -q ./src/plugins/commands -d ./src-dist/plugins/commands --transforms jsx,typescript,imports', {stdio: 'inherit'});
				console.log('Hotpatching Commands...');
				client.commands.clear();
				client.commands = new Map();
				// Yes, I know this can just be done with an exportable function, No I'm not doing it
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
			// Yes, I still need to add shit such as events, and whatever
			return;
		}
	},
	aliases: [],
	description: 'Hotpatches Events(TODO) and Commands.(Operators only)',
	type: 'dev',
	usage: 'hotpatch <commands/events>',
};

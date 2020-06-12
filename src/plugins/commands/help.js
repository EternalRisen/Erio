'use strict';
const fs = require('fs').promises;
const path = require('path');

module.exports = {
	/* eslint-disable */
    run: async (client, message, args) => {
        /* eslint-enable */
		const command = args[0];
		let text;
		if (!command) {
			const files = await fs.readdir(path.join(__dirname, '../../plugins/commands'));
			for (const file of files) {
				if (file.endsWith('js')) {
					text += `\n${file.substring(0, file.indexOf('.js'))}:  Aliases: [${client.commands.get(file.substring(0, file.indexOf('.js'))).aliases}]`;
				}
			}
			message.channel.send(`\`\`\`${text}\`\`\`\nSome commands do not have aliases.\nSee \`\`${client.prefix}help <command>\`\` for more info on a command.\nI'm still under development, so please be patient for more commands to appear on my list.`);
		}
		else {
			try {
				text = `\`${client.prefix}${command}\`: Usage: ${client.commands.get(command).usage}, ${client.commands.get(command).description}`;
			}
			catch (err) {
				text = (`Error:  Command(${command}) not found.`);
			}
			message.channel.send(`${text}`);
		}
	},
	aliases: ['h'],
	description: 'Tells the user the latency.',
	usage: 'help <command(optional)>',
};
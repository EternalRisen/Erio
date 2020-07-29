'use strict';

import Discord = require('discord.js');

const fs = require('fs').promises;
const path = require('path');

module.exports = {
    run: async (client: { commands: { get: (arg0: string) => { type: string; aliases: string[]; description: string; usage: string }; }; prefix: string; }, message: Discord.Message, args: Array<string>) => {
		const command = args[0];
		let utilText = 'Utility:  ';
		let funText = 'Fun:  ';
		let modText = 'Moderation:  ';
		let commandText;
		if (!command) {
			const files = await fs.readdir(path.join(__dirname, '../../plugins/commands'));
			for (const file of files) {
				const cmdName = file.substring(0, file.indexOf('.js'));
				if (file.endsWith('js')) {
					switch (client.commands.get(cmdName).type) {
					case 'util':
						utilText += `\n${cmdName}:  Aliases: [${client.commands.get(cmdName).aliases}]`;
						break;
					case 'fun':
						funText += `\n${cmdName}:  Aliases: [${client.commands.get(cmdName).aliases}]`;
						break;
					case 'mod':
						modText += `\n${cmdName}:  Aliases: [${client.commands.get(cmdName).aliases}]`;
						break;
					case 'dev':
						// We just do nothing here.
						break;
					}
				}
			}
			message.channel.send(`\`\`\`${utilText}\`\`\`\n\`\`\`${modText}\`\`\`\n\`\`\`${funText}\`\`\`Some commands do not have aliases.\nSee \`\`${client.prefix}help <command>\`\` for more info on a command.\nI'm still under development, so please be patient for more commands to appear on my list.`);
		}
		else {
			try {
				switch(client.commands.get(command).type) {
				case 'util':
					commandText = `${command}:  Aliases: [${client.commands.get(command).aliases}]\nDescription: ${client.commands.get(command).description}\nUsage:  ${client.prefix}${client.commands.get(command).usage}`;
					break;
				case 'fun':
					commandText = `${command}:  Aliases: [${client.commands.get(command).aliases}]\nDescription: ${client.commands.get(command).description}\nUsage:  ${client.prefix}${client.commands.get(command).usage}`;
					break;
				case 'mod':
					commandText = `${command}:  Aliases: [${client.commands.get(command).aliases}]\nDescription: ${client.commands.get(command).description}\nUsage:  ${client.prefix}${client.commands.get(command).usage}`;
					break;
				case 'dev':
					commandText = (`Error:  Command(${command}) not found.`);
					break;
				}
			}
			catch (err) {
				commandText = (`Error:  Command(${command}) not found.`);
			}
			message.channel.send(`${commandText}`);
		}
	},
	aliases: ['h'],
	description: 'Returns the help message',
	type: 'util',
	usage: 'help <command(optional)>',
};
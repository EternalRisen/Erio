/*
* shell command:  Does a bash command in the terminal.  DO NOT LET PEASANTS USE!!
*/

import Discord from 'discord.js';

module.exports = {
	run: async (client: { devs: string | string[]; }, message: Discord.Message, args: Array<string>) => {
		if (client.devs.includes(message.author.id)) {
			const cmd = args.join(' ');
			await require('child_process').exec(cmd, (stderr: string, stdout: string) => {
				if (stdout.length > 1800) {
					const outChunks: string[] = [];
					for (let i = 0, charsLength = stdout.length; i < charsLength; i += 1800) {
    					outChunks.push(stdout.substring(i, i + 1800));
					}
					for (let out of outChunks) {
						message.channel.send(`\`\`\`js\n${out}\`\`\``);
					}
				} else {
					message.channel.send(`${stdout}`);
				}
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
}

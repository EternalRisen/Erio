/*
* say command:  just returns what you said after issuing the command
*/

import Discord from 'discord.js';

module.exports = {
    run: (client: { devs: string | string[]; }, message: Discord.Message, args: Array<string>) => {
		let sayMessage = args.join(' ');
		if (sayMessage === '') {
			sayMessage = args.join(' ') + `Nothin to say eh?  ${message.author}`;
			message.channel.send(sayMessage);
			return;
		}
		if (!client.devs.includes(message.author.id)) {
			sayMessage += `\n- ${message.author.tag}`;
		}
		else {
			if (['dm'].includes(message.channel.type)) {

			} else {
				message.delete();
			}
		}
		message.channel.send(sayMessage);
	},
	aliases: [],
	description: 'deletes the command message and returns with a sent message containing the content after the command name',
	type: 'fun',
	usage: 'say <text>',
}

/*
* avatar command:  returns the avatar of a specified user or your own if you don't specify someone, or that user isn't found
*/

import Discord from 'discord.js';
import { getAvatar } from '../../structs/getavatar';

module.exports = {
    run: async (client: { users: { fetch: (arg0: string) => Promise<Discord.User>; }; }, message: Discord.Message, args: Array<string>) => {
		let targetUser = args[0];

		// Replace shit in case it's a mention and not the actual ID
		try {
			targetUser = targetUser.replace('<@', '');
			try {
				targetUser = targetUser.replace('!', '');
			} catch (e) {
				console.log(`'!' was not replaceable because discord is massively retarded`);  // Seriously, they are
			}
			targetUser = targetUser.replace('>', '');
		}
		catch (e) {
			// console.log() the debug for now until i add a debug log.
			console.log(`Can't replace the string.  The user must have either inputted something wrong, or are just wanting their own avatar.  ${e}`);
		}

		const embed = new Discord.MessageEmbed();

		client.users.fetch(targetUser).then((user: Discord.User) => {
			embed.setTitle(`${message.author.tag} Wants to see ${user.tag}'s Avatar!`);
			embed.setImage(getAvatar(user, '2048'));
			message.channel.send(embed);
		}).catch((e: Error) => {
			console.log(`We just need to log this somewhere else in the future when I add other things. ${e}`);
			embed.setTitle(`${message.author.tag} Wants to see their own Avatar!`);
			embed.setImage(getAvatar(message.author, '2048'));
			message.channel.send(embed);
		});
	},
	aliases: ['a'],
	description: 'returns with the user\'s avatar',
	type: 'util',
	usage: 'avatar <user>',
}

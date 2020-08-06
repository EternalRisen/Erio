'use strict';

import Discord = require('discord.js');

import { getAvatar } from '../../structs/getavatar';

const MessageAttachment = Discord.MessageAttachment;

module.exports = {
    run: async (client: { users: { fetch: (arg0: string) => Promise<Discord.User>; }; }, message: Discord.Message, args: Array<string>) => {
		let targetUser = args[0];

		try {
			targetUser = targetUser.replace('<@', '');
			try {
				targetUser = targetUser.replace('!', '');
			} catch (e) {
				console.log(`'!' was no replacable because discord is massively retarded`);
			}
			targetUser = targetUser.replace('>', '');
		}
		catch (e) {
			// console.log() the debug for now until i add a debug log.
			console.log(`Can't replace the string.  The user must have either inputted something wrong, or are just wanting their own avatar.  ${e}`);
		}

		client.users.fetch(targetUser).then((user: Discord.User) => {
			const avatar = new MessageAttachment(getAvatar(user, '2048'));
			message.channel.send(`${user.tag}'s avatar:`, avatar);
		}).catch((e: Error) => {
			console.log(`We just need to log this somewhere else in the future when I add other things. ${e}`);
			const user = message.author;
			const avatar = new MessageAttachment(getAvatar(user, '2048'));
			message.channel.send(`${user.tag}'s avatar:`, avatar);
		});
	},
	aliases: ['a'],
	description: 'returns with the user\'s avatar',
	type: 'util',
	usage: 'avatar <user>',
};
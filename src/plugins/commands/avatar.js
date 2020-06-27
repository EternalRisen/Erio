'use strict';

const { MessageAttachment } = require('discord.js');

function getAvatar(user) {
	const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
	const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=2048`;
	return avatarURL;
}

module.exports = {
	/* eslint-disable */
    run: async (client, message, args) => {
		/* eslint-enable */
		let targetUser = args[0];

		try {
			targetUser = targetUser.replace('<!@', '');
			targetUser = targetUser.replace('>', '');
		} catch (e) {
			// console.log() the debug for now until i add a debug log.
			console.log(`Can't replace the string.  The user must have either inputted something wrong, or are just wanting their own avatar.  ${e}`);
		}

		client.users.fetch(targetUser).then(user => {
			const avatar = new MessageAttachment(getAvatar(user));
			message.channel.send(`${user.tag}'s avatar:`, avatar);
		}).catch(e => {
			console.log(`We just need to log this somewhere else in the future when I add other things. ${e}`);
			const user = message.author;
			const avatar = new MessageAttachment(getAvatar(user));
			message.channel.send(`${user.tag}'s avatar:`, avatar);
		});
	},
	aliases: ['a'],
	description: 'returns with the user\'s avatar',
	usage: 'avatar <user>',
};
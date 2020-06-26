'use strict';

const { MessageAttachment } = require('discord.js');

function getAvatar(user) {
	return `${user.displayAvatarURL().replace('.webp', '.png')}?size=2048`;
}

module.exports = {
	/* eslint-disable */
    run: async (client, message, args) => {
        /* eslint-enable */
		client.users.fetch(args[0]).then(user => {
			const avatar = new MessageAttachment(getAvatar(user));
			message.channel.send(`${user.tag}'s avatar:`, avatar);
		}).catch(e => {
			console.log(`We just need to log this somewhere else in the future when I add other things. ${e}`);
			const user = message.mentions.users.first() || message.author;
			const avatar = new MessageAttachment(getAvatar(user));
			message.channel.send(`${user.tag}'s avatar:`, avatar);
		});
	},
	aliases: ['a'],
	description: 'returns with the user\'s avatar',
	usage: 'avatar <user>',
};
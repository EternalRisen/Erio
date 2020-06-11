'use strict';

module.exports = {
	/* eslint-disable */
	run: async (client, message, args) => {
        /* eslint-enable */
        const choices = args.join(' ').split(', ');
		message.reply(`I choose: ${choices[Math.floor(Math.random() * choices.length)]}`);
	},
	aliases: ['pick'],
	description: 'Makes a random choice between the choices given.',
};

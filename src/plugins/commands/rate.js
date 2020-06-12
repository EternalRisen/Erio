'use strict';

module.exports = {
	/* eslint-disable */
	run: async (client, message, args) => {
        /* eslint-enable */
        const rateString = args.join(' ');
        let rating = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
		message.reply(`I rate ${rateString} a ${rating[Math.floor(Math.random() * rating.length)]}/10`);
	},
	aliases: [],
	description: 'Makes a random choice between the choices given.',
};
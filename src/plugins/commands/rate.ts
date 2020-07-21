'use strict';

import Discord = require('discord.js');

module.exports = {
	run: async (client: Discord.Client, message: Discord.Message, args: Array<string>) => {
		let rateString = args.join(' ');
		if (rateString === '') return message.reply('Give Me Something to rate!');
		if (rateString === 'me') {
			rateString = 'you';
		}
		// TODO:  Replace 'my' with 'your'
		const rating = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
		message.reply(`I rate ${rateString} a ${rating[Math.floor(Math.random() * rating.length)]}/10`);
	},
	aliases: [],
	description: 'Makes a random choice between the choices given.',
	type: 'fun',
	usage: 'rate <text>',
};
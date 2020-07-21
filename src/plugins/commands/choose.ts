'use strict';

import Discord = require('discord.js');

module.exports = {
	run: async (client: Discord.Client, message: Discord.Message, args: Array<string>) => {
		const choices = args.join(' ').split(', ');
		if (choices[0] === '') return message.reply('Please give options.');
		if (!choices[1]) return message.reply('I need more than one option to choose.');
		message.reply(`I choose: ${choices[Math.floor(Math.random() * choices.length)]}`);
	},
	aliases: ['pick'],
	description: 'Makes a random choice between the choices given.',
	type: 'fun',
	usage: 'choose <choice1>, <choice2>, ...',
};

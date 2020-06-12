'use strict';

const { isOperator } = require('../../structs/verification.js');
const { inspect } = require('util');

module.exports = {
	/* eslint-disable */
	run: async (client, message, args) => {
		/* eslint-enable */
		if (isOperator(message.author.id)) {
			let evaled;
			try {
				evaled = eval(args.join(' ').slice());
				message.channel.send(inspect(evaled));
			}
			catch (err) {
				message.channel.send(`${err.message}`);
			}
		}
		else {
			return;
		}
	},
	aliases: ['e'],
	description: 'Runs a console eval if the user is an operator.(operators only)',
	usage: 'eval <code>',
};

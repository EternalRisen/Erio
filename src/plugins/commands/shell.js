'use strict';

const { isOperator } = require('../../structs/verification.js');
const { child_process } = require('child_process');

module.exports = {
	/* eslint-disable */
	run: async (client, message, args) => {
		/* eslint-enable */
		if (isOperator(message.author.id)) {
			const cmd = args.join(' ');
			child_process.exec(cmd, (err, stdout, stderr) => {
				if (err) {
					message.reply('There was an error with your request.');
					throw new Error(err);
				}
				message.channel.send((`${stdout}${stderr}`));
			});
		}
		else {
			return;
		}
	},
	aliases: [],
	description: 'Runs bash command if the user is an operator.(operators only)',
	usage: 'shell <command>',
};

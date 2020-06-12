'use strict';

const { isOperator } = require('../../structs/verification.js');
const { exec } = require('child_process');

module.exports = {
	/* eslint-disable */
	run: async (client, message, args) => {
		/* eslint-enable */
		if (isOperator(message.author.id)) {
			const cmd = args.join(' ');
			exec(cmd, (stdout, stderr) => {
				message.channel.send((`${stderr}`));
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

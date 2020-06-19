'use strict';

const { isOperator } = require('../../structs/verification.js');
const { exec } = require('child_process');

module.exports = {
	/* eslint-disable */
	run: async (client, message, args) => {
		/* eslint-enable */
		if (isOperator(message.author.id)) {
			for (const dev of client.devs) {
				client.users.fetch(dev).then(user => {
					user.send(`${client.user.username} is being restarted by ${message.author.tag}(${message.author.id})`);
				});
			}

			exec('node bot');

			setTimeout(() => {
				process.exit();
			}, 20000);
		}
		else {
			return;
		}
	},
	aliases: [],
	description: 'Restarts the bot.(Operatos only.)',
	usage: 'restart',
};

'use strict';

module.exports = {
	/* eslint-disable */
    run: (client, message, args) => {
        /* eslint-enable */
		message.reply(`Pong!\n ${client.ws.ping}ms is the latency`);
	},
	aliases: ['p'],
	description: 'Tells the user the latency.',
};

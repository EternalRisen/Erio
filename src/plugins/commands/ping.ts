'use strict';

import Discord = require('discord.js');

module.exports = {
    run: (client: { ws: { ping: any; }; }, message: Discord.Message, args: Array<string>) => {
		message.reply(`Pong!\n ${client.ws.ping}ms is the latency`);
	},
	aliases: ['p'],
	description: 'Tells the user the latency.',
	type: 'util',
	usage: 'ping',
};

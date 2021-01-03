/*
* ping command:  Just returns the API response time.
*/

import Discord = require('discord.js');

module.exports = {
	run: (client: { ws: { ping: any; }; }, message: Discord.Message, args: string[]) => {
		message.reply(`Pong!\n ${client.ws.ping}ms is the latency`);
	},
	aliases: [],
	description: 'Tells the user the latency.',
	type: 'util',
	usage: 'ping',
}

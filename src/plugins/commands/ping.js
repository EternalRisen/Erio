'use strict';

module.exports = {
    run: async(client, message, args) => {
        message.reply(`Pong!\n ${client.ws.ping}ms is the latency`);
    }
}

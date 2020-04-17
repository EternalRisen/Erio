'use strict';

const { isOperator } = require('../../structs/verification');
const { inspect } = require('util');

module.exports = {
    run: async (message, args) => {
        if (isOperator) {let evaled;
            try {
                evaled = eval(args.join(' ').slice());
                message.channel.send(inspect(evaled));
            }
            catch (err) {
                message.channel.send(`${err.message}`);
            }
        } else return;
    },
    aliases: ['e'],
    description: 'Runs a console eval if the user is an operator',
}
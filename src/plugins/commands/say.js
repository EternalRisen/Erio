'use strict';

module.exports = {
	/* eslint-disable */
    run: (client, message, args) => {
        /* eslint-enable */
		let sayMessage = args.join(' ');
		if (sayMessage === '') {
			sayMessage = args.join(' ') + 'Nothin to say eh?  ' + message.author;
		}
		message.delete();
		message.channel.send(sayMessage);
	},
	aliases: ['s'],
	description: 'deletes the command message and returns with a sent message containing the content after the command name',
};

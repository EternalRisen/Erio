'use strict';

const Discord = require('discord.js');

module.exports = {
    /* eslint-disable */
    run: async (client, message, args) => {
        /* eslint-enable */
        let user;

        try {
            user = client.users.fetch(args[0]);
        } catch (e) {
            user = message.mentions.members.first() || message.author;
        }
        const avatarEmbed = new Discord.MessageEmbed()
        .setAuthor(user.username)
        .addField(`text`, `${user.tag}'s Avatar:`)
        .setImage(user.avatarURL)
        .setColor('#11f2eb');
        message.channel.send(avatarEmbed);
    },
    aliases: ['a'],
    description: 'returns with the user\'s avatar',
    usage: 'avatar <user>'
}
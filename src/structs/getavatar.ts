import Discord = require('discord.js');


export function getAvatar(user: Discord.User, size: string | number) {
	const ext = user.avatar!.startsWith('a_') ? 'gif' : 'png';
	size = size || '128';
	const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`;
	return avatarURL;
}

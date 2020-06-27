module.exports.getAvatar = (user) => {
	const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
	const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=2048`;
	return avatarURL;
};
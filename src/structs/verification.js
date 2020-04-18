const { botAdmins } = require('../../config/config.json');

module.exports.isOperator = (authorID) => {
	return botAdmins.includes(authorID);
};

module.exports.isAdmin = (targetMember) => {
	return targetMember.hasPermissions(['ADMINISTRATOR']);
};

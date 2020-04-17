const { botAdmins } = require('../../config/config.json');

module.exports.isOperator = (message) => {
    return botAdmins.includes(message.author.id);
}

module.exports.isAdmin = (message) => {
    return message.member.hasPermissions(['ADMINISTRATOR']);
}

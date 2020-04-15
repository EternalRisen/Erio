const Discord = require('discord.js');
const config = require('../config/config.json');

class YeetBot {
	constructor() {
		this.client = new Discord.Client();
		this.token = config.token;
		this.channels = config.channels;
		this.roles = config.roles;
		this.bannedWords = config.bannedWords;
		this.prefix = config.prefix;
        this.operators = config.botAdmins;
		this.loggedIn = false;

		this.client.on('ready', this.onReady.bind(this));
		this.client.on('error', this.onError.bind(this));
		this.client.on('message', this.onMessage.bind(this));
	}

	onReady() {
		console.log(`${this.client.user.tag} is online`);
	}

	onError(e) {
		console.log(`${this.client.user.tag} error: ${e}`);
    }
	
    onMessage() {
		if (this.message.author.bot) return;

    }

	login(token) {
		if (this.loggedIn) throw new Error('Cannot call login() twice');

		this.loggedIn = true;
		this.client.login(token);
	}
}

module.exports = YeetBot;

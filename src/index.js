const fs = require('fs').promises;
const path = require('path');
const Discord = require('discord.js');
const config = require('../config/config.json');
const { checkCommandModule, checkProperties } = require('./structs/validate.js');

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
		this.client.commands = new Map();
		const client = this.client;

		this.client.on('ready', this.onReady.bind(this));
		this.client.on('error', this.onError.bind(this));
		this.client.on('message', async message => {
			if (message.author.bot) return;
			if (!message.content.startsWith(this.prefix)) return;
			const args = message.content.substring(message.content.indexOf(this.prefix) + 1).split(new RegExp(/\s+/));
			const cmd = args.shift();

			if(client.commands.get(cmd)) {
				client.commands.get(cmd).run(client, message, args);
			}
			else {
				return;
			}
		});
	}

	onReady() {
		console.log(`${this.client.user.tag} is online`);
	}

	onError(e) {
		console.log(`${this.client.user.tag} error: ${e}`);
	}

	async loadCommands() {
		if (this.loggedIn) throw new Error('Cannot load commands after the bot has logged in');

		console.log('Loading Commands...');
		const files = await fs.readdir(path.join(__dirname, 'plugins/commands'));
		for (const file of files) {
			if (file.endsWith('.js')) {
				try {
					const cmdName = file.substring(0, file.indexOf('.js'));
					const cmdModule = require(path.join(__dirname, 'plugins/commands/', file));
					if (checkCommandModule(cmdName, cmdModule)) {
						if (checkProperties(cmdName, cmdModule)) {
							const { aliases } = cmdModule;
							this.client.commands.set(cmdName, cmdModule);
							if(aliases.length !== 0) {
								aliases.forEach(alias => this.client.commands.set(alias, cmdModule));
							}
							console.log(`Command loaded:  ${cmdName}:  ${cmdModule.description}`);
						}
					}
				}
				catch (err) {
					console.log(err);
				}
			}
		}
	}

	login(token) {
		if (this.loggedIn) throw new Error('Cannot call login() twice');

		this.loggedIn = true;
		this.client.login(token);
	}
}

module.exports = YeetBot;

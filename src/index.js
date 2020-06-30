const fs = require('fs').promises;
const path = require('path');
const Discord = require('discord.js');
const config = require('../config/config.json');
const { checkCommandModule, checkProperties } = require('./structs/validate.js');

class YeetBot {
	constructor() {
		this.client = new Discord.Client();
		this.client.devs = config.botAdmins;
		this.token = config.token;
		this.client.prefix = config.prefix;
		this.loggedIn = false;
		this.commandsLoaded = false;
		this.client.commands = new Map();
		const client = this.client;

		this.client.on('ready', () => {
			for (const dev of client.devs) {
				client.users.fetch(dev).then(user => {
					user.send(`${client.user.tag} is online.`);
					user.send('(Mainly for testing.  Don\'t worry.)');
				});
			}
		});

		this.client.on('error', (err) => {
			this.onError(err);
		});

		this.client.on('message', async message => {
			if (this.commandsLoaded === false) return;
			if (message.author.bot) return;
			if (message.content.toLowerCase() === 'help' || message.content.includes(client.user.id)) {
				message.reply(`My Prefix is \`${this.client.prefix}\`.  please see \`${this.client.prefix}help\` to see a list of my commands.`);
			}
			if (!message.content.startsWith(this.client.prefix)) return;
			const args = message.content.substring(message.content.indexOf(this.client.prefix) + 1).split(new RegExp(/\s+/));
			const cmd = args.shift();

			if (client.commands.get(cmd)) {
				client.commands.get(cmd).run(client, message, args);
			}
			else {
				return;
			}
		});

		process.on('uncaughtException', err => {
			this.onError(err);
		});

		process.on('unhandledRejection', err => {
			this.onError(err);
		});
	}

	onReady() {
		console.log(`${this.client.user.tag} is online`);
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
		this.commandsLoaded = true;
	}

	onError(err) {
		for (const dev of this.client.devs) {
			this.client.users.fetch(dev).then(user => {
				user.send(`${this.client.user.tag} Error:  ${err}.`);
				console.log(err);
			});
		}
	}

	login(token) {
		if (this.loggedIn) throw new Error('Cannot call login() twice');

		this.loggedIn = true;
		this.client.login(token);
	}
}

module.exports = YeetBot;

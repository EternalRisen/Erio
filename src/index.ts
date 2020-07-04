import Discord = require('discord.js');

const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config.json');
const { checkCommandModule, checkProperties } = require('./structs/validate.js');

class YeetBot{
	// TODO:  Give this a type other than 'any'
	protected client: any;

	constructor() {
		this.client = new Discord.Client();
		this.client.devs = config.botAdmins;
		this.client.token = config.token;
		this.client.prefix = config.prefix;
		this.client.loggedIn = false;
		this.client.commandsLoaded = false;
		this.client.commands = new Map();

		this.client.on('ready', () => {
			this.messageDevs(this.client.devs, `Logged in as ${this.client.user.tag}`);

			this.client.user.setPresence({
				activity: {
					name: 'JD-San Develop me',
					type: 'WATCHING',
				},
			});
		});

		this.client.on('error', (err: Error) => {
			this.messageDevs(this.client.devs, `Error: ${err}\nat ${err.stack}`);
			fs.writeFile('./errors.log', `Error: ${err}\nat ${err.stack}\n \n`);
		});

		this.client.on('message', async (message: Discord.Message) => {
			if (this.client.commandsLoaded === false) return;
			if (message.author.bot) return;
			if (message.content.toLowerCase() === 'help' || message.content.includes(this.client.user.id)) {
				message.reply(`My Prefix is \`${this.client.prefix}\`.  please see \`${this.client.prefix}help\` to see a list of my commands.`);
			}
			if (!message.content.startsWith(this.client.prefix)) return;
			const args = message.content.substring(message.content.indexOf(this.client.prefix) + 1).split(new RegExp(/\s+/));
			const cmd = args.shift();

			if (this.client.commands.get(cmd)) {
				this.client.commands.get(cmd).run(this.client, message, args);
			}
			else {
				return;
			}
		});
		process.on('uncaughtException', (err: Error) => {
			this.messageDevs(this.client.devs, `Error: ${err}\nat ${err.stack}`);
			fs.writeFile('./errors.log', `Error: ${err}\nat ${err.stack}\n \n`);
		});

		process.on('unhandledRejection', (err: Error) => {
			this.messageDevs(this.client.devs, `Error: ${err}\nat ${err.stack}`);
			fs.writeFile('./errors.log', `Error: ${err}\nat ${err.stack}\n \n`);
		});
	}

	onReady() {
		console.log(`${this.client.user.tag} is online`);
	}

	async loadCommands() {
		if (this.client.loggedIn) throw new Error('Cannot load commands after the bot has logged in');

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
								// aliases.forEach(alias => this.client.commands.set(alias, cmdModule));
								aliases.forEach((alias: string) => {
									this.client.commands.set(alias, cmdModule);
								});
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
		this.client.commandsLoaded = true;
	}

	async messageDevs(devs: Array<string>, message: string) {
		for (let dev of devs) {
			dev = await this.client.users.fetch(dev);
			if (!dev) return;
			(dev as unknown as Discord.TextChannel).send(message);
		}
	}

	login(token: string) {
		if (this.client.loggedIn) throw new Error('Cannot call login() twice');

		this.client.login(token);
		this.client.loggedIn = true;
	}
}

module.exports = YeetBot;

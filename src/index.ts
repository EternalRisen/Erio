import Discord = require('discord.js');

const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require('./structs/validate.js');

class Client extends Discord.Client { 
    public commands: any = new Map(); 
    public commandsLoaded: boolean = false; 
    public devs: Array<string> = []; 
    public prefix: string = ''; 
    public loggedIn: boolean = false;
}

class ErioBot{
    protected client: Client;

    constructor() {
        this.client = new Client();
		this.client.devs = process.env.ADMINS?.split(',') || [];
		this.client.token = (process.env.TOKEN as string);
        this.client.prefix = `${process.env.PREFIX}`;
        this.client.loggedIn = false;
        this.client.commandsLoaded = false;
        this.client.commands = new Map();

		this.client.on('ready', () => {
			if (!this.client || !this.client.user) {
				console.log('onReady fired before the bot could log in. Exiting...');
				process.exit();
			}
			this.dumpLogs(`I\'m Logged in!`);

			this.client.user!.setPresence({
				activity: {
					name: 'JD-San Develop me',
					type: 'WATCHING',
				},
			});
		});

		this.client.on('error', (err: Error) => {
			this.dumpLogs(`Error: ${err}\nat ${err.stack}`);
		});

		this.client.on('message', async (message: Discord.Message) => {
			if (this.client.commandsLoaded === false) return;
			if (message.author.bot) return;
			if (message.content.toLowerCase() === 'help' || message.content.includes(this.client.user!.id)) {
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
			this.dumpLogs(`Error: ${err}\nat ${err.stack}`);
		});

		process.on('unhandledRejection', (err: Error) => {
			this.dumpLogs(`Error: ${err}\nat ${err.stack}`);
		});
	}

	onReady() {
		console.log(`${this.client.user!.tag} is online`);
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

	async dumpLogs(logMessage: string) {
		try {
			let logChannel = await this.client.channels.fetch((process.env.BOTLOG as string));
			(logChannel as Discord.TextChannel).send(logMessage);
		} catch (e) {
			console.error(e);
		}
	}

	connect(token: string) {
		if (this.client.loggedIn) throw new Error('Cannot call connect() twice');

		this.client.login(token);
		this.client.loggedIn = true;
	}
}

module.exports = ErioBot

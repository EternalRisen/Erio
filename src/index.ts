import Discord = require('discord.js');

const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require('./structs/validate.js');

class Client extends Discord.Client { 
	// set all this up so I can customize shit
	public commands: any = new Map();
	public serverQueue: Object = {}
	public commandsLoaded: boolean = false; 
	public devs: Array<string> = []; 
	public prefix: string = ''; 
	public loggedIn: boolean = false;
}

class ErioBot{
	protected client: Client;

	constructor() {
		this.client = new Client();
		// Set values
		this.client.serverQueue = {};
		this.client.devs = process.env.ADMINS?.split(',') || [];
		this.client.token = (process.env.TOKEN as string);
		this.client.prefix = `${process.env.PREFIX}`;
		this.client.loggedIn = false;
		this.client.commandsLoaded = false;
		this.client.commands = new Map();

		this.client.on('ready', async () => {
			if (!this.client || !this.client.user) {
				await console.log('onReady fired before the bot could log in. Exiting...');
				process.exit();
			}
			// Should Never happen

			// Tell me that the bot is on.
			console.log(`Logged in as ${this.client.user.tag}!`);

			// Set the presence
			await this.client.user!.setPresence({
				activity: {
					name: 'JD-San Develop me',
					type: 'WATCHING',
				},
			});
		});

		// Crash handling
		this.client.on('error', async (err: Error) => {
			await this.dumpLogs(`Error: ${err}\nat ${err.stack}`);
		});

		this.client.on('message', async (message: Discord.Message) => {
			// You should have commands loaded
			if (this.client.commandsLoaded === false) return;
			// Bots have no access
			if (message.author.bot) return;
			// Help stuff in case people are absolutely retarded
			if (message.content.toLowerCase() === 'help' || message.content.includes(this.client.user!.id)) {
				message.reply(`My Prefix is \`${this.client.prefix}\`.  please see \`${this.client.prefix}help\` to see a list of my commands.`);
			}
			// All flipped tables should be unflipped
			if (message.content.includes('(╯°□°）╯︵ ┻━┻')) {
				message.channel.send('┬─┬ ノ( ゜-゜ノ)');
			}
			// Start actual command shit
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

		// More crash handling
		process.on('uncaughtException', async (err: Error) => {
			await this.dumpLogs(`Error: ${err}\nat ${err.stack}`);
		});

		process.on('unhandledRejection', async (err: Error) => {
			await this.dumpLogs(`Error: ${err}\nat ${err.stack}`);
		});
	}

	// Load commands
	async loadCommands() {
		// idk, don't ask me why
		if (this.client.loggedIn) throw new Error('Cannot load commands after the bot has logged in');

		// any console.log here is useless but helps I guess
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

	// Makes less lines in the code
	async dumpLogs(logMessage: string) {
		try {
			let logChannel = await this.client.channels.cache.get((process.env.BOTLOG as string));
			(logChannel as Discord.TextChannel).send(logMessage);
		} catch (e) {
			console.error(logMessage);
		}
	}

	// idk
	connect(token: string) {
		if (this.client.loggedIn) throw new Error('Cannot call connect() twice');

		this.client.login(token);
		this.client.loggedIn = true;
	}
}

module.exports = ErioBot

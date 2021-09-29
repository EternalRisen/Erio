import Discord from 'discord.js';
import PG from 'pg';
import FS from 'fs';
import path from 'path';
import { checkCommandModule, checkProperties} from './structs/validate';

const fs = FS.promises;

// Configure SSL to be true or false for psql db
let ssl_enabled = false;
console.log(process.env.SSL_ENABLED)
if (parseInt((process.env.SSL_ENABLED as any)) === 1 /*0 means false, 1 means true*/) {
	ssl_enabled = true;
} // just stay false if variable doesn't exist or does not equal 1

class Client extends Discord.Client {
	// set all this up so I can customize shit
	public commands: any = new Map();
	public serverQueue: {} = {}
	public commandsLoaded: boolean = false;
	public devs: string[] = [];
	public prefix: string = '';
	public loggedIn: boolean = false;
	public pool: any = undefined;
	public serverCache: any = {};
}

class ErioBot{
	protected client: Client;

	constructor() {
		this.client = new Client();
		// Set values
		this.client.serverQueue = {};
		this.client.devs = process.env.ADMINS?.split(',') || [];
		this.client.token = (process.env.TOKEN as string);
		this.client.prefix = `${process.env.PFX}`;
		this.client.loggedIn = false;
		this.client.commandsLoaded = false;
		this.client.commands = new Map();
		this.client.pool = new PG.Pool({
			connectionString: `${process.env.DATABASE_URL || `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`}`,
		});
		this.client.serverCache = {};

		// set ssl to true or false
        if (ssl_enabled === true) {
            this.client.pool.options.ssl = {
                rejectUnauthorized: false
          }
        }

		this.client.on('messageDelete', async message => {
			const embed = new Discord.MessageEmbed();
			embed.setTitle(`A message has been deleted`)
			embed.addField('Author:', `${message.author}`);
			embed.addField('Channel:', `${message.channel}`);
			embed.addField('Content:', `${message.content}` || 'Empty Message or was an embed');
			embed.addField('Attachments', message.attachments.map((a) => a.url).join('\n') || 'No attatchments')

			let channelid;
			let channel;

			channelid = this.client.serverCache[(message.guild?.id as any)].modlog;

			try {
				channel = await this.client.channels.fetch(channelid);
			} catch {
				return;
			};

			(channel as Discord.TextChannel).send(embed);
		});

		this.client.on('ready', async () => {
			if (!this.client || !this.client.user) {
				console.log('onReady fired before the bot could log in. Exiting...');
				process.exit();
			};
			// Should Never happen

			// Tell me that the bot is on.
			console.log(`Logged in as ${this.client.user.tag}, serving ${this.client.guilds.cache.size} servers with the prefix of ${this.client.prefix}`);

			const nameArr = ['uwu', 'owo', 'bot things', 'the watchful night'];

			await this.client.user!.setPresence({
				activity: {
					name: nameArr[Math.floor(Math.random() * nameArr.length)],
					type: 'PLAYING',
				}
			});

			// Cache Servers from database
			await this.cache_servers();

			// Sync database cache with discord cache
			for (const serverid in this.client.serverCache) {
				// Delete any servers the bot is no longer in
				let server: any = this.client.guilds.cache.find(s => s.id === serverid);
				if (server) {
					// Do nothing
				} else {
					delete this.client.serverCache[serverid];
					// Delete from database
					await this.client.pool.query('DELETE FROM welcome_messages WHERE serverid = $1', [serverid])
					await this.client.pool.query('DELETE FROM roles WHERE serverid = $1', [serverid]);
					await this.client.pool.query('DELETE FROM servers WHERE serverid = $1', [serverid]);
				}

				// update the cache
				for (let server of this.client.guilds.cache.array()) {
					let serverid = (server as any).id;
					// see if the server exists in cache or not
					if (!this.client.serverCache[serverid]) {
						// add to cache
						this.client.serverCache[serverid] = {
							serverid: serverid,
							serverName: (server as any).name,
							modlog: null,
							muteRole: null,
							welcomeChannel: null,
							welcomeMessage: null,
							welcomeImage: null
						};
						await this.client.pool.query('INSERT INTO servers (serverid, servername)  VALUES ($1, $2)', [serverid, server.name]);
						await this.client.pool.query('INSERT INTO welcome_messages (serverid) VALUES ($1)', [serverid]);
						const erioRole = server.roles.cache.find(r => r.name === this.client.user?.username);
						const erioPos = erioRole?.rawPosition;
						let removeable = true;
						server.roles.cache.forEach(async role => {
							if (role.rawPosition >= (erioPos as number)) {
								removeable = false;
							};
							await this.client.pool.query('INSERT INTO roles (roleid, serverid, rolename, roleposition, removeable) VALUES ($1, $2, $3, $4, $5)', [role.id, serverid, role.name, role.rawPosition.toString(), removeable]);
						});
					} else {
						let s = this.client.serverCache[serverid];
						// update the cache if the servername doesn't match
						if (s.serverName !== server.name) {
							s.serverName = server.name;
							// update the database
							await this.client.pool.query('UPDATE servers SET servername = $1', [server.name])
						}
					}
				}
			}

			setInterval(async () => {
				await this.client.user!.setPresence({
					activity: {
						name: nameArr[Math.floor(Math.random() * nameArr.length)],
						type: 'PLAYING',
					}
				});
			}, 1000 * 60 * Math.floor(Math.random() * 60));
		});

		// Crash handling
		this.client.on('error', async (err: Error) => {
			await this.dumpLogs(`Error: ${err}\nat ${err.stack}`);
		});

		this.client.on('guildCreate', async guild => {
			this.client.serverCache[guild.id] = {
				serverid: guild.id,
				serverName: guild.name,
				modlog: null,
				muteRole: null,
				welcomeChannel: null,
				welcomeMessage: null,
				welcomeImage: null
			};
			await this.client.pool.query('INSERT INTO servers (serverid, servername)  VALUES ($1, $2)', [guild.id, guild.name]);
			await this.client.pool.query('INSERT INTO welcome_messages (serverid) VALUES ($1)', [guild.id]);
			const erioRole = guild.roles.cache.find(r => r.name === this.client.user?.username);
			const erioPos = erioRole?.rawPosition;
			let removeable = true;
			guild.roles.cache.forEach(async role => {
				if (role.rawPosition >= (erioPos as number)) {
					removeable = false;
				};
				await this.client.pool.query('INSERT INTO roles (roleid, serverid, rolename, roleposition, removeable) VALUES ($1, $2, $3, $4, $5)', [role.id, guild.id, role.name, role.rawPosition.toString(), removeable]);
			});
		});

		this.client.on('guildDelete', async guild => {
			// delete server from cache
			delete this.client.serverCache[guild.id];
			// remote server data and other things from database
			await this.client.pool.query('DELETE FROM welcome_messages WHERE serverid = $1', [guild.id])
			await this.client.pool.query('DELETE FROM roles WHERE serverid = $1', [guild.id]);
			await this.client.pool.query('DELETE FROM servers WHERE serverid = $1', [guild.id]);
		});

		this.client.on('roleCreate', async role => {
			let erioRole = role.guild.roles.cache.find(r => r.name === this.client.user?.username);
			let erioPos = erioRole?.rawPosition;
			let removeable = true;
			if (role.rawPosition >= (erioPos as number)) {
				removeable = false;
			};
			await this.client.pool.query('INSERT INTO roles (roleid, serverid, rolename, roleposition, removeable) VALUES ($1, $2, $3, $4, $5)', [role.id, role.guild.id, role.name, role.rawPosition.toString(), removeable]);
		});

		this.client.on('roleUpdate', async role => {
			const erioRole = role.guild.roles.cache.find(r => r.name === this.client.user?.username);
			const erioPos = erioRole?.rawPosition;
			const worker = await this.client.pool.connect();
			role.guild.roles.cache.forEach(async r => {
				let removeable = true;
				if (r.rawPosition >= (erioPos as number)) {
					removeable = false;
				};
				await worker.query('UPDATE roles SET rolename = $1, roleposition = $2, removeable = $3 WHERE roleid = $4', [r.name, r.rawPosition, removeable, r.id]);
			});
			worker.release();
		});

		this.client.on('roleDelete', async role => {
			await this.client.pool.query('DELETE FROM roles WHERE roleid = $1', [role.id]);
		});

		function getmsglink(message: Discord.Message): string {
			let guildid
			let channelid = message.channel.id;
			if (message.guild === null) guildid =  "@me";
			return `https://discord.com/channels/${guildid}/${channelid}/${message.id}`;
		}

		this.client.on('messageUpdate', async (message: any, oldmsg: any) => {
			if (message.author.id === '755288011909890050') {
				let logchannel = await this.client.channels.fetch('892619566000271390');
				(logchannel as any).send(`\`\`\`\n${message.author.tag} - ${message.guild.name || 'in dms'}\noldmsg:  ${oldmsg.content}\nnewmsg:  ${message.content}\nmsglink: ${getmsglink(message)}\n\`\`\``)
			}
		})

		this.client.on('message', async (message: Discord.Message) => {
			// logging parin
			if (message.author.id === '755288011909890050') {
				let logchannel = await this.client.channels.fetch('892619566000271390');
				(logchannel as any).send(`\n\`\`\`\n${message.author.tag} - ${message.guild?.name || 'in dms'}\nmsg:     ${message.content}\nmsglink: ${getmsglink(message)}\n\`\`\`\n`);
			}

			// You should have commands loaded
			if (this.client.commandsLoaded === false) return;
			// Bots have no access
			if (message.author.bot) return;
			// Help stuff in case people are absolutely retarded
			if (message.content === (`<@!${this.client.user?.id}>`)) {
				message.reply(`My Prefix is \`${this.client.prefix}\`.  please see \`${this.client.prefix}help\` to see a list of my commands.`);
			};
			// All flipped tables should be unflipped
			if (message.content.includes('(╯°□°）╯︵ ┻━┻')) {
				message.channel.send('┬─┬ ノ( ゜-゜ノ)');
			};
			// Start actual command shit
			if (!message.content.startsWith(this.client.prefix)) return;
			const args = message.content.substring(message.content.indexOf(this.client.prefix) + 1).split(new RegExp(/\s+/));
			const cmd = args.shift();

			if (this.client.commands.get(cmd)) {
				this.client.commands.get(cmd).run(this.client, message, args);
			} else {
				return;
			};
		});

		// More crash handling
		process.on('uncaughtException', async (err: Error) => {
			await this.dumpLogs(`Error: ${err}\nat ${err.stack}`);
		});

		process.on('unhandledRejection', async (err: Error) => {
			await this.dumpLogs(`Error: ${err}\nat ${err.stack}`);
		});
	};

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
							if (aliases.length !== 0) {
								// aliases.forEach(alias => this.client.commands.set(alias, cmdModule));
								aliases.forEach((alias: string) => {
									this.client.commands.set(alias, cmdModule);
								});
							};
							console.log(`Command loaded:  ${cmdName}:  ${cmdModule.description}`);
						};
					};
				} catch (err) {
					console.log(err);
				};
			};
		};
		this.client.commandsLoaded = true;
	};

	// Makes less lines in the code
	async dumpLogs(logMessage: string) {
		try {
			const logChannel = this.client.channels.cache.get((process.env.BOTLOG as string));
			(logChannel as Discord.TextChannel).send(logMessage);
		} catch (e) {
			console.error(logMessage);
		};
	};

	async cache_servers() {
		console.log('caching servers...')
		const res = await this.client.pool.query(`
		SELECT * FROM servers
		INNER JOIN welcome_messages using (serverid)
		`);
		for (const row of res.rows) {
			this.client.serverCache[row.serverid] = {
				serverName: row.servername,
				serverid: row.serverid,
				modlog: row.modlog,
				muteRole: row.muterole,
				welcomeChannel: row.welcomechannel,
				welcomeMessage: row.welcome_message,
				welcomeImage: row.welcome_image
			};
			console.log(`cached ${row.servername}`);
		};
	};

	// idk
	connect(token: string) {
		if (this.client.loggedIn) throw new Error('Cannot call connect() twice');

		this.client.login(token);
		this.client.loggedIn = true;
	};
};

module.exports = ErioBot;

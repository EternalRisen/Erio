'use strict';

import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import got from 'got';

module.exports = {
    run: async (client: any /*I'm too lazy to do typing for this one*/, message: Discord.Message, args: string[]) => {
        if (!message.member?.voice.channel) return message.reply('You are not in a voice channel');
        const perms = message.member?.voice.channel.permissionsFor(client.user);
        if (!perms?.has("CONNECT") || !perms?.has("SPEAK")) {
            return message.channel.send(
              "I need the permissions to join and speak in your voice channel!  FUCKING ALLOW ME IF YOU WANT MUSIC"
            );
        }
        let query = args.join(' ');
        let res;
        if (query === '') return message.reply('you provided nothing for me to play');
        if (!client.serverQueue[message.guild!.id]) {
            client.serverQueue[message.guild!.id] = {
                queue: []
            }
        }

        async function getLink(q: string) {
            res = await got(`https://www.googleapis.com/youtube/v3/search?q=${q}&key=${process.env.YTKEY}`);

            const items = JSON.parse(res.body);

            let vidID = items.items[0].id.videoId;
            let link = '';
            console.log(items.items.length);
            if (vidID === undefined || vidID === null) {
                message.channel.send('Hey, we couldn\'t find a video at the top.  So we will provide you the top 5(?) items.');
                let queries = '(if it returns undefined, it\'s not a video)';
                for (let i = 0; i < items.items.length; i++) {
                    let j = i + 1;
                    async function getInfo(link: string) {
                        let info;
                        let undef;
                        try {
                            info = await ytdl.getInfo(link);
                        } catch (e) {
                            undef =  'Undefined Video';
                        }
                        if (info) {
                            return `${info.videoDetails.title}`;
                        } else {
                            return undef;
                        }
                    }
                    queries += `\n${j} ${getInfo(`https://youtube.com/watch?v=${items.items[i].id.videoId}`)}`;
                }
                message.channel.send(queries);
                const filter = (m: any) => m.content;
                const collector = message.channel.createMessageCollector(filter, { time: 15000 });
                let conf = false;

                collector.on('collect', m => {
                    if (m.author !== message.author) return;
                    if (conf === true) return;
                    let num = parseInt(m.content);
                    if (isNaN(num)) return message.reply('This isn\'t a number.');
                    if (num > items.items.length) return message.reply(`This number isn't a valid number.  Try a number that is lower than ${num}`);
                    let arrNum = num -1;
                    vidID = items.items[arrNum].id.videoId;
                    if (!vidID) return message.reply('Seriously??  I just said that it\'s not a video if it returns undefined...');
                    conf = true;
                    console.log('here we go!')
                    link = `https://youtube.com/watch?v=${vidID}`;
                    message.reply('Alright, I\'ll add it to the queue.');
                    client.serverQueue[message.guild!.id].queue.push(link);
                });

                collector.on('end', () => {
                    if (conf === false) {
                        message.reply('You took too long.  Finding the best match out of the top 5 results...')
                        for (let vids of items.items) {
                            if (vids.id.videoId) {
                                link = `https://youtube.com/watch?v=${vids.id.videoId}`;
                                client.serverQueue[message.guild!.id].queue.push(link);
                                message.channel.send('Found!');
                            } else {
                                return message.channel.send('nothing found... nothing will be added to the queue');
                            }
                        }
                    }
                });
            } else {
                console.log(items.items[0]);
                link = `https://youtube.com/watch?v=${vidID}`;
                client.serverQueue[message.guild!.id].queue.push(link);
                console.log(link);
            }
            //return link;
        }

        if (!query.startsWith('https://youtube.com/')) {
            getLink(query);
        } else if (!query.startsWith('https://youtu.be/')) {
            getLink(query);
        } else if (query.startsWith('https://')) {
            return message.reply('This isn\'t a valid URL/Query for me to use.');
        } else {
            client.serverQueue[message.guild!.id].queue.push(query);
        }

        message.channel.send('Added your request to the queue!');

        async function play(connection: Discord.VoiceConnection, message: Discord.Message) {
            client.serverQueue[message.guild!.id].dispatcher = connection.play(ytdl(client.serverQueue[message.guild!.id].queue[0], {filter: 'audioonly'}));

            const songInfo = await ytdl.getInfo(client.serverQueue[message.guild!.id].queue[0])
            message.channel.send(`Now Playing:  ${songInfo.videoDetails.title}\n${songInfo.videoDetails.video_url}`);

            client.serverQueue[message.guild!.id].queue.shift();

            client.serverQueue[message.guild!.id].dispatcher.on('finish', () => {
                if (client.serverQueue[message.guild!.id].queue[0]) {
                    play(connection, message);
                } else {
                    message.channel.send('welp, I\'m outta songs');
                    connection.disconnect();
                }
            })

            client.serverQueue[message.guild!.id].dispatcher.on('error', async (err: Error) => {
                message.channel.send(`An Error Has occurred:  ${err}`);
                client.serverQueue[message.guild!.id].queue.shift();
                if (client.serverQueue[message.guild!.id].queue[0]) {
                    play(connection, message);
                } else {
                    message.channel.send('Guess I don\'t have anything to play.  (maybe I\'m waiting for you to provide a video from the list)')
                    connection.disconnect();
                }
                try {
                    let logChannel = await client.channels.cache.get((process.env.BOTLOG as string));
                    (logChannel as Discord.TextChannel).send(`An error with ytdl has occurred:  ${err.message}`);
                    (logChannel as Discord.TextChannel).send(`At:\n${err.stack}`);
                } catch (e) {
                    console.error(`An error with ytdl has ocurred: \n ${err}`);
                }
            })
        }
        if (!message.guild!.voice?.connection) {
            message.member?.voice.channel.join().then(connection => {
                play(connection, message)
            })
        }
    },
    aliases: ['p'],
    description: 'Plays music, what else?',
    type:  'fun',
    usage: 'play <link | name of vid>',
}
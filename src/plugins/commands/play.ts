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

            const vidID = items.items[0].id.videoId;
            console.log(items.items[0]);
            let link = `https://youtube.com/watch?v=${vidID}`;
            console.log(link)
            return link;
        }

        if (!query.startsWith('https://youtube.com/')) {
            query = await getLink(query);
        } else if (!query.startsWith('https://youtu.be/')) {
            query = await getLink(query);
        }

        client.serverQueue[message.guild!.id].queue.push(query);
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
                    message.channel.send('welp, I\'m outta songs')
                    connection.disconnect();
                }
            })

            client.serverQueue[message.guild!.id].dispatcher.on('error', async (err: Error) => {
                message.channel.send(`An Error Has occurred:  ${err}`);
                try {
                    let logChannel = await client.channels.cache.get((process.env.BOTLOG as string));
                    (logChannel as Discord.TextChannel).send(`An error with tydl has occurred:  ${err.message}`);
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
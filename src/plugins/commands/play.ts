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
        let canConnect = false;
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
                canConnect = false;
                //console.log(canConnect);
                message.channel.send('Hey, we couldn\'t find a video at the top.  So we will provide you the top 5(?) items.');
                let queries = '(if it returns undefined, it\'s not a video)';
                for (let i = 0; i < items.items.length; i++) {
                    let j = i + 1;
                    
                    let songInfo;
                    //console.log(link);
                    try {
                        songInfo = await ytdl.getInfo(`https://youtube.com/watch?v=${items.items[i].id.videoId}`);
                        //console.log(songInfo);
                        queries+= `\n${j} ${songInfo.videoDetails.title} https://youtube.com/watch?v=${items.items[i].id.videoId}`;
                    } catch (e) {
                        queries+=  `\n${j} Undefined Video`;
                    }
                    
                    //queries += `\n${j} ${getInfo(`https://youtube.com/watch?v=${items.items[i].id.videoId}`)}`;
                }
                return message.channel.send(`\`\`\`${queries}\`\`\`\n\nYou will need to paste the link with this command again if you want to play it`);
            } else {
                //console.log(items.items[0]);
                link = `https://youtube.com/watch?v=${vidID}`;
                client.serverQueue[message.guild!.id].queue.push(link);
                //console.log(link);
            }
            //return link;
        }

        if (!query.startsWith('https://youtube.com/')) {
            getLink(query);
            canConnect = true;
        } else if (!query.startsWith('https://youtu.be/')) {
            getLink(query);
            canConnect = true;
        } else if (!query.startsWith('https://')) {
            client.serverQueue[message.guild!.id].queue.push(query);
        } else {
            return message.reply('This isn\'t a valid URL/Query for me to use.');
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
            if (canConnect === false) return;
            console.log(canConnect);
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
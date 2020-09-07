import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
const app = express();
let commands: any;

if (!process.env.PORT) {
    console.log('port not specified... Defaulting to port 3000.');
    console.log('if you see this and wonder what\'s going on, use "npm run serve".');
}

let USERS: Array<any> = [];
let credits: Array<any> = [];

const ErioBot = require('../../src-dist/index');
const clientDir = path.join(__dirname, '../');

const getAvatar = (user: typeof ErioBot, size: string | number) => {
	const ext = user.avatar!.startsWith('a_') ? 'gif' : 'png';
	size = size || '128';
	const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`;
	return avatarURL;
};

app.use(express.static(clientDir));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(clientDir, 'index.html'));
});

app.get('/commands', (req: Request, res: Response) => {
    commands = require('../../src-dist/plugins/list');
    res.sendFile(path.join(clientDir, 'commands.html'));
});

app.get('/commands.json', (_: Request, res: Response) => {
    res.json(commands.default);
    commands = []
});

app.get('/users.json', (req: Request, res: Response) => {
    try {
        res.json(USERS);
        USERS = []
    } catch (e) {
        console.error(e);
    }
});

app.get('/users', async (req: Request, res: Response) => {
    let userID: string[] = String(req.query.user).split(',');
    try {
        for (const userid of userID) {
            const user = await bot.client.users.fetch((userid as string));
            USERS.push({
                avatar: getAvatar((user as typeof ErioBot), 2048),
                createdAt:  user.createdAt.toUTCString(),
                tag: user.tag,
                id: user.id
            });
        }
    } catch (e) {
        console.error(e);
        USERS.push({
            avatar: '',
            createdAt: 'User not found',
            tag: 'Make sure the ID is correct',
            id: 'Otherwise I can\'t return a user\'s information.'
        })
    }
    res.sendFile(path.join(clientDir, 'users.html'));
});

app.get('/credits', async (req: Request, res: Response) => {
    let jd = await bot.client.users.fetch('615249674084810763');
    let byn = await bot.client.users.fetch('187524257280950272');

    credits = [
        {
            avatar: getAvatar(jd, 2048),
            discordTag: jd.tag,
            name: 'JD',
            intro: `Hi!  I'm JD.  I'm the one responsible for the development of the discord bot (and the design for the site now..), along with the backend of the site!`,
            message: `If you ever have any questions you can always message me at ${jd.tag} if you have any questions about Erio!`,
            github: `Also, you can find the official repo to the bot`,
            role: 'Bot Development',
            site: 'https://github.com/YaBoiJD/Erio'
        },
        {
            avatar: getAvatar(byn, 2048),
            discordTag: byn.tag,
            name: 'Robyn',
            intro: `Hi!  I'm Robyn.  I'm the one responsible for the front end of the site (a very small portion of it, anyways)`,
            message: `I'm a dead website designer for the site, so right now it's all JD that's doing it.`,
            github: `Also, you can find my github`,
            role: 'Designer extraordinaire',
            site: 'https://github.com/GameModerator'
        }
    ];

    res.sendFile(path.join(clientDir, 'credits.html'));
});

app.get('/credits.json', async (req: Request, res: Response) => {
    res.json(credits);
    credits = [];
});

// idk what this does so I'm just going to leave this here and ask later.
app.get('/:subpage', (req: Request, res: Response, next: NextFunction) => {
    const file = path.join(clientDir, req.params.subpage + '.html');
    fs.exists(file, (exists: boolean) => {
        if (exists) {
            res.charset = 'utf8';
            fs.createReadStream(file).pipe(res);
        } else {
            next();
        }
    });
});

app.use((req: Request, res: Response) => {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`));

const bot = new ErioBot();

bot.loadCommands();

bot.connect(bot.client.token);

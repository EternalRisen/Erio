import { Request, Response, json } from 'express';
// sucrase refuses to map src/ to src-dist/, hardcode output dir
// @ts-ignore
const commands = require('../../src-dist/plugins/list');

if (!process.env.PORT) {
    console.log('port not specified... Defaulting to port 3000.');
    console.log('if you see this and wonder what\'s going on, use "npm run serve".');
}

let USER: any;

const ErioBot = require('../../src-dist/index');
const bot = new ErioBot();

bot.loadCommands();

bot.connect(bot.client.token);

function getAvatar(user: typeof ErioBot, size: string | number) {
	const ext = user.avatar!.startsWith('a_') ? 'gif' : 'png';
	size = size || '128';
	const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`;
	return avatarURL;
};

const express = require('express');
const path = require('path');

const app = express();

const clientDir = path.join(__dirname, '../');

app.use(express.static(clientDir));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(clientDir, 'index.html'));
});

app.get('/commands', (req: Request, res: Response) => {
    res.sendFile(path.join(clientDir, 'commands.html'));
});

app.get('/commands.json', (_: Request, res: Response) => {
    // Mixing ES6 modules with CommonJS modules can lead to stupid shit like this but oh well
    res.json(commands.default);
});

app.get('/user.json', (req: Request, res: Response) => {
    try {
        res.json(USER);
    } catch (e) {
        res.json(e);
    }
})

app.get('/user', async (req: Request, res: Response) => {
    let userID = req.query.user
    console.log(userID);
    try {
        const user = await bot.client.users.fetch((userID as string));
    } catch (e) {
        // handle this later
        console.error(e);
    }
    const user = await bot.client.users.fetch((userID as string));
    USER = {
        avatar: getAvatar((user as typeof ErioBot), 2048),
        createdAt:  user.createdAt.toUTCString(),
        tag: user.tag,
        id: user.id
    }
    console.log(USER);
    res.sendFile(path.join(clientDir, 'user.html'));
});


app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`));

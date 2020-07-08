import { Request, Response } from 'express';
// sucrase refuses to map src/ to src-dist/, hardcode output dir
// @ts-ignore
const commands = require('../../src-dist/plugins/list');

const express = require('express');
const path = require('path');

const app = express();

const clientDir = path.join(__dirname, '../');

app.use(express.static(clientDir));

app.get('/', (_: any, res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(path.join(clientDir, 'index.html'));
});

app.get('/commands', (_: any, res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(path.join(clientDir, 'commands.html'));
});

app.get('/commands.json', (_: Request, res: Response) => {
    // Mixing ES6 modules with CommonJS modules can lead to stupid shit like this but oh well
    res.json(commands.default);
});

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`));

const express = require('express');
const path = require('path');

const app = express();

const clientDir = path.join(__dirname, '../');

app.use(express.static(clientDir));

app.get('/', (_: any, res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(path.join(clientDir, 'index.html'));
});

app.get('/commands', (_: any, res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(path.join(clientDir, 'commandindex.html'));
});

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`));
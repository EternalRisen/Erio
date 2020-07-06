const express = require('express');
const path = require('path');

require('dotenv').config({ path: './.env'});

const app = express();

const DIST_DIR = path.join(__dirname, '../');
const HTML_DIR = path.join(DIST_DIR, 'index.html');

app.use(express.static(DIST_DIR));

app.get('/', (_: any, res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(HTML_DIR);
});

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`));
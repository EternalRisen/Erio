const path = require('path');
const YeetBot = require('./src/index.js');
const client = new YeetBot();

client.loadPluginDir(path.join(__dirname, 'src', 'plugins'));

client.commander.loadCommandDir(path.join(__dirname, 'src', 'plugins', 'commander', 'commands'));

client.login(client.token);
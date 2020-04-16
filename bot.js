const YeetBot = require('./src/index.js');
const client = new YeetBot();

client.loadCommands();

client.login(client.token);

/* import React = require('react');
import ReactDOM = require('react-dom');
import fs = require('fs');

function getCommands() {
    const files = fs.readdirSync('./src-dist/plugins/commands');

    let cmdString = '';

    for (const file of files) {
        const cmdName = file.substring(0, file.indexOf('.js'));
        const cmdModule = require(`../../src-dist/plugins/commands/${file}`);
        cmdString += `${cmdName}:\nUsage:  ${cmdModule.usage}\nDescription:  ${cmdModule.description}\nAliases:  ${cmdModule.aliases}\nType:  ${cmdModule.type}`
    }
    return cmdString;
}

ReactDOM.render(<p>{getCommands()}</p>, document.getElementById('commands')); */
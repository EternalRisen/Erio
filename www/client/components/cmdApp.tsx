import React from 'react';
import fs from 'fs';

import './App.css';

require('../../../src-dist/plugins/commands/')

function getCommands() {
    const files = fs.readdirSync('./src-dist/plugins/commands');

    let cmdString = '';

    for (const file of files) {
        const cmdName = file.substring(0, file.indexOf('.js'));
        const cmdModule = require(`../../../src-dist/plugins/commands/${file}`);
        cmdString += `${cmdName}:\nUsage:  ${cmdModule.usage}\nDescription:  ${cmdModule.description}\nAliases:  ${cmdModule.aliases}\nType:  ${cmdModule.type}`
    }

    return cmdString;
}

const App = () => {
    return (
        <div
            className={`wallpaper`}
        >
            {getCommands()}
        </div>
    );
};

export default App;
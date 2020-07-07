import React from 'react';

// import fs from 'fs';

import path from 'path';

import './App.css';

const listReactFiles = require('list-react-files');

async function getCommands() {
    const files = await listReactFiles(path.join(__dirname, '../../../src-dist/plugins/commands'))
    // const files = fs.readdirSync('./src-dist/plugins/commands');

    let cmdString = '';

    let file: any;

    for (file of files) {
        const cmdName = file.substring(0, file.indexOf('.js'));
        const cmdModule = require(`../../../src-dist/plugins/commands/${file}`);
        cmdString += `${cmdName}\n${cmdModule.type}\n${cmdModule.usage}\n${cmdModule.description}`
        // cmdString += `${cmdName}`;
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
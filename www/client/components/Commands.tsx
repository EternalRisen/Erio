import React from 'react';
import './App.css';

// import fs from 'fs';

// TODO:  Require the bot command modules and return it's string and array values in the DOM

/* import path from 'path';

const listReactFiles = require('list-react-files');


const files = listReactFiles(path.join(__dirname, '../../../src-dist/plugins/commands'))
// const files = fs.readdirSync('./src-dist/plugins/commands');

let cmdString = '';

let file: any;

for (file of files) {
    const cmdName = file.substring(0, file.indexOf('.js'));
    const cmdModule = require(`../../../src-dist/plugins/commands/${file}`);
    cmdString += `${cmdName}\n${cmdModule.type}\n${cmdModule.usage}\n${cmdModule.description}`
    cmdString += `\n${cmdName}`;
} */


const Commands = () => {
    return (
        <div className={`wallpaper`}>
            Commands: NOT IMPLEMENTED YET.
        </div>
    );
};

export default Commands;
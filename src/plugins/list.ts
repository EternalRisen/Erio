import fs from 'fs';
import path from 'path';

interface Command {
    run: Function;
    name: string;
    aliases: string[];
    description: string;
    type: string;
    usage: string;
}

const COMMANDS_PATH = path.join(__dirname, 'commands');
const files = fs.readdirSync(COMMANDS_PATH);
const commands: Command[] = [];

for (const file of files) {
    const cmdName = file.substring(0, file.indexOf('.js'));
    const cmdModule = require(path.join(COMMANDS_PATH, file));

    commands.push({ name: cmdName, ...cmdModule });
}

export default commands;

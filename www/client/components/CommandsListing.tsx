import React from 'react';

import CommandItem from './CommandItem';

// Magical source of truth for all TypeScript shenanigans because I say it is
export interface Command {
    name: string;
    description: string;
    aliases: string[];
    type: string;
    usage: string;
}

// I don't know how to mixin React types so hope you never use any components with children
interface CommandsListingProps {
    commands: Command[];
}

const CommandsListing: React.FC<CommandsListingProps> = ({ commands }) => {
    return (
        <div>
            {commands.map(command =>
                <CommandItem key={command.name} command={command} />
            )}
        </div>
    )
};

export default CommandsListing;

import React from 'react';
// Yes, the types placement is messy; no, that's none of my business
import { Command } from './CommandsListing';

import './CommandItem.css';

interface CommandItemProps {
    command: Command;
}

const CommandItem: React.FC<CommandItemProps> = ({ command }) => {
    return (
        <div className="command-item">
            <div className="title">~{command.name} {command.aliases.length !== 0 && <span className="aliases">({command.aliases.join(', ')})</span>}</div>
            <div className="description">{command.description}</div>
            <div className="usage">~{command.usage}</div>
        </div>
    )
};

export default CommandItem;

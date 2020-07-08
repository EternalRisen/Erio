import React, { useState, useEffect } from 'react';
import './App.css';

import CommandsListing, { Command } from './CommandsListing';

const Commands = () => {
    const [commands, setCommands] = useState(null);
    // Run this effect only on component initialization thanks to its empty dependency array
    useEffect(() => {
        fetch('/commands.json')
            .then(res => res.json())
            .then(data => setCommands(data));
    }, []);

    return (
        <div className='wallpaper'>
            {
                commands === null
                    ? 'Loading commands...'
                    // Retarded typescript can't infer that it isn't null even though it's right above
                    : <CommandsListing commands={commands as unknown as Command[]} />
            }
        </div>
    );
};

export default Commands;

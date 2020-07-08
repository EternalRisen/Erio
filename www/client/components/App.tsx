import React from 'react';

import './App.css';
import FlatButton from './FlatButton';

const App = () => {
    return (
        <div className={`wallpaper`} >
            <FlatButton>Let me take you to our commands!</FlatButton>
            <FlatButton>Invite me to your server!</FlatButton>
            <p>This is the base to the Erio Website</p>
        </div>
    );
};

export default App;
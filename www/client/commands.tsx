import React from 'react';
import ReactDOM from 'react-dom';
import Commands from './components/Commands';
import Header from './components/Header';

ReactDOM.render(<Header />, document.getElementById('heading'));
ReactDOM.render(<Commands />, document.getElementById('commands'));
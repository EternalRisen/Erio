import React from 'react';
import ReactDOM from 'react-dom';
import Users from './components/Users';
import Header from './components/Header';

ReactDOM.render(<Header />, document.getElementById('heading'));
ReactDOM.render(<Users />, document.getElementById('users'));
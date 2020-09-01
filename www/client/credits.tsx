import React from 'react';
import ReactDOM from 'react-dom';
import Credits from './components/Credits';
import Header from './components/Header';

ReactDOM.render(<Header />, document.getElementById('heading'));
ReactDOM.render(<Credits />, document.getElementById('credits'));
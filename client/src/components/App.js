import React from 'react';
import axios from 'axios';

import '../styles/App.css';

import Login from './Login';
import Filters from './Filters';
import Chart from './Chart';
import Downloader from './Downloader';

import favicon from '../images/favicon.png';

class App extends React.Component {
    render() {
        return (
            <div className='App'>
                <div className='header'>
                    <div className='logo'>
                        <img src={favicon}/>
                        <h1>Melonizer</h1>
                        <img src={favicon}/>
                    </div>
                    <Login/>
                </div>
                <Downloader/>
                <h2>멜론 TOP 100</h2>
                <Filters/>
                <Chart/>
            </div>
        );
    }
}

export default App;

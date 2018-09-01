import React from 'react';
import axios from 'axios';

import '../styles/App.css';

import Login from './Login';
import Filters from './Filters';
import Chart from './Chart';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            chart: {
                songs: []
            },
            loggedIn: false
        };
        this.retrieveChart = this.retrieveChart.bind(this);
        this.logOut = this.logOut.bind(this);
    }
    retrieveChart(chartType, classCd) {
        this.setState({ chart: {songs: [], updatedDate: '', retrievedDate: '', chartType, classCd }});
        axios.get('/api/charts', { params: { chartType, classCd } })
        .then((res) => {
            this.setState({
                chart: res.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }
    logOut() {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('name');
        this.setState({
            loggedIn: false
        });
    }
    render() {
        return (
            <div className='App'>
                <div className='header'>
                    <h1>Melonizer</h1>
                    <Login loggedIn={this.state.loggedIn} logOut={this.logOut}/>
                </div>
                <h2>멜론 TOP 100</h2>
                <Filters retrieveChart={this.retrieveChart} chart={this.state.chart}
                    logOut={this.logOut}/>
                <Chart chart={this.state.chart}/>
            </div>
        );
    }
    componentDidMount() {
        if (sessionStorage.authToken) {
            this.setState({
                loggedIn: true
            });
        }
    }
}

export default App;

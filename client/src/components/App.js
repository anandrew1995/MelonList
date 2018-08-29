import React from 'react';
import axios from 'axios';

import '../styles/App.css';

import Login from './Login';
import Filters from './Filters';
import Export from './Export';
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
        this.setState({
            loggedIn: false
        });
    }
    render() {
        return (
            <div className='App'>
                <Login loggedIn={this.state.loggedIn} logOut={this.logOut}/>
                <h1>멜론 TOP 100</h1>
                <Filters retrieveChart={this.retrieveChart}/>
                <Chart chart={this.state.chart}/>
                {this.state.loggedIn ? <Export chart={this.state.chart} logOut={this.logOut}/> : null}
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

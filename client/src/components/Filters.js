import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import Exporter from './Exporter';

import * as chartActions from '../actions/chartActions';
import * as userActions from '../actions/userActions';

import MelonFilters from '../melonFilters';
import '../styles/Filters.css';

class Filters extends React.Component {
    constructor() {
        super();
        this.retrieveChart = this.retrieveChart.bind(this);
        this.setChartType = this.setChartType.bind(this);
        this.setClassCd = this.setClassCd.bind(this);
        this.logOut = this.logOut.bind(this);
    }
    retrieveChart() {
        this.props.dispatch(chartActions.fetchChart(this.props.chart.chartType, this.props.chart.classCd));
    }
    setChartType(e) {
        this.props.dispatch(chartActions.updateChart({ chartType: e.currentTarget.value }));
    }
    setClassCd(e) {
        this.props.dispatch(chartActions.updateChart({ classCd: e.currentTarget.value }));
    }
    logOut() {
        this.props.dispatch(userActions.logOut());
    }
    render() {
        return (
            <div className='Filters'>
                <div className='filter'>
                    <div className='filterName'>차트 기간</div>
                    <div>
                        {MelonFilters.filter((filter) => (filter.hasOwnProperty('chartType'))).map((period) => (
                            <div className='filterItem' key={period.chartType}>
                                <label>
                                    <input type='radio' name='chartType' value={period.chartType}
                                        checked={period.chartType === this.props.chart.chartType}
                                        onChange={this.setChartType}/>
                                    {period.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='line'></div>
                {MelonFilters.filter((filter) => (filter.hasOwnProperty('genres'))).map((filterType) => (
                    <div className='filter' key={filterType.name}>
                        <div className='filterName'>{filterType.name}</div>
                        <div>
                            {filterType.genres.map((filter) => (
                                <div className='filterItem' key={filter.classCd}>
                                    <label>
                                        <input type='radio' name='genre' value={filter.classCd}
                                            checked={filter.classCd === this.props.chart.classCd}
                                            onChange={this.setClassCd}/>
                                        {filter.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className='buttons'>
                    <Button bsStyle='info' onClick={this.retrieveChart}>불러오기</Button>
                    {this.props.user.loggedIn ?
                        <Exporter/> : null}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        chart: store.chart,
        user: store.user
    };
}

export default connect(mapStateToProps)(Filters);

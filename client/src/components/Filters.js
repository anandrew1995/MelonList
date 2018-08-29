import React from 'react';

import MelonFilters from '../melonFilters';
import '../styles/Filters.css';

class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: MelonFilters,
            chartType: 'month',
            classCd: 'GN0000'
        };
        this.setChartType = this.setChartType.bind(this);
        this.setClassCd = this.setClassCd.bind(this);
        this.retrieveChart = this.retrieveChart.bind(this);
    }
    setChartType(e) {
        this.setState({
            chartType: e.currentTarget.value
        });
    }
    setClassCd(e) {
        this.setState({
            classCd: e.currentTarget.value
        });
    }
    retrieveChart() {
        this.props.retrieveChart(this.state.chartType, this.state.classCd);
    }
    render() {
        return (
            <div className='Filters'>
                <div className='filter'>
                    <div className='filterName'>차트 기간</div>
                    <div>
                        {this.state.filters.filter((filter) => (filter.hasOwnProperty('chartType'))).map((period) => (
                            <div className='filterItem' key={period.chartType}>
                                <input type='radio' name='chartType' value={period.chartType}
                                    checked={period.chartType === this.state.chartType}
                                    onChange={this.setChartType}/>
                                {period.name}
                            </div>
                        ))}
                    </div>
                </div>
                {this.state.filters.filter((filter) => (filter.hasOwnProperty('genres'))).map((filterType) => (
                    <div className='filter' key={filterType.name}>
                        <div className='filterName'>{filterType.name}</div>
                        <div>
                            {filterType.genres.map((filter) => (
                                <div className='filterItem' key={filter.classCd}>
                                    <input type='radio' name='genre' value={filter.classCd}
                                        checked={filter.classCd === this.state.classCd}
                                        onChange={this.setClassCd}/>
                                    {filter.name}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <button className='retrieve btn btn-secondary' onClick={this.retrieveChart}>불러오기</button>
            </div>
        )
    }
    componentDidMount() {
        this.retrieveChart();
    }
}

export default Filters;

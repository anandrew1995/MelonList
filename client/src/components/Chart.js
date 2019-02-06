import React from 'react'
import { connect } from 'react-redux'

import '../styles/Chart.css'

import * as chartActions from '../actions/chartActions'

class Chart extends React.Component {
    render() {
        return (
            <div className='Chart'>
                {
                    this.props.chart.songs.length > 0 ?
                    <div className='table'>
                        <div className='tableTitle'>{this.props.chart.playlistTitle}</div>
                        <table>
                            <tbody>
                                <tr><th>순위</th><th>제목</th><th>가수</th><th>유투브 링크</th></tr>
                                {this.props.chart.songs.map((song) => (
                                    <tr key={song.rank}>
                                        <td>{song.rank}</td>
                                        <td>{song.title}</td>
                                        <td>{song.artist}</td>
                                        <td>
                                            <a href={'https://www.youtube.com/watch?v='+song.videoId} target='_blank' >
                                                {song.videoTitle.length > 20 ? `${song.videoTitle.substring(0,20)}...` : song.videoTitle}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    : <div>로딩중...</div>
                }
                {this.props.chart.retrievedDate ? <div>차트 업데이트: {this.props.chart.retrievedDate}</div> : null}
            </div>
        )
    }
    componentDidMount() {
        this.props.dispatch(chartActions.fetchChart(this.props.chart.chartType, this.props.chart.classCd))
    }
}

const mapStateToProps = (store) => {
    return {
        chart: store.chart
    }
}

export default connect(mapStateToProps)(Chart)

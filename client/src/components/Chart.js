import React from 'react';

import '../styles/Chart.css';

import Loader from './Loader';

class Chart extends React.Component {
    render() {
        return (
            <div className='Chart'>
                {
                    this.props.chart.songs.length > 0 ?
                    <div className='table'>
                        <div className='updatedDate'>{this.props.chart.updatedMelonDate}</div>
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
                    : <Loader/>
                }
                {this.props.chart.retrievedMelonDate ? <div>차트 업데이트: {this.props.chart.retrievedMelonDate}</div> : null}
            </div>
        )
    }
}

export default Chart;

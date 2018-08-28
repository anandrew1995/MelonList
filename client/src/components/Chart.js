import React from 'react';

import '../styles/Chart.css';

import Loader from './Loader';
import Filters from './Filters';

class Chart extends React.Component {
    render() {
        return (
            <div className='Chart'>
                <h1>멜론 TOP 100</h1>
                <Filters retrieveChart={this.props.retrieveChart}/>
                {this.props.updatedDate ? <div>{this.props.updatedDate}</div> : null}
                {this.props.songs.length > 0 ? null : <Loader/>}
                <table>
                    <tbody>
                        {this.props.songs.length > 0 ? <tr><th>순위</th><th>제목</th><th>가수</th><th>유투브 링크</th></tr> : null}
                        {this.props.songs ?
                            this.props.songs.map((song) => (
                            <tr key={song.rank}>
                                <td>{song.rank}</td>
                                <td>{song.title}</td>
                                <td>{song.artist}</td>
                                <td>
                                    <a href={'https://www.youtube.com/watch?v='+song.videoId} target="_blank" >
                                        {song.videoTitle.length > 20 ? `${song.videoTitle.substring(0,20)}...` : song.videoTitle}
                                    </a>
                                </td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
                {this.props.retrievedDate ? <div>차트 업데이트: {this.props.retrievedDate}</div> : null}
            </div>
        )
    }
}

export default Chart;

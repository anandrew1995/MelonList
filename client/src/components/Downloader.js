import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Downloader extends React.Component {
    constructor() {
        super();
        this.downloadYoutube = this.downloadYoutube.bind(this);
    }
    downloadYoutube() {
        const body = {
            playlistTitle: this.props.chart.playlistTitle,
            songs: this.props.chart.songs
        }
        axios.post('/api/charts/download', body)
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    render() {
        return (
            <div className='Downloader'>
                <button onClick={this.downloadYoutube}>Download</button>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        chart: store.chart
    };
}

export default connect(mapStateToProps)(Downloader);

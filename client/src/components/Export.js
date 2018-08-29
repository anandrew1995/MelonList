import React from 'react';
import axios from 'axios';

// import '../styles/Loader.css';
import MelonFilters from '../melonFilters';

class Export extends React.Component {
    constructor(props) {
        super(props);
        this.addVideoToPlaylist = this.addVideoToPlaylist.bind(this);
        this.exportToPlaylist = this.exportToPlaylist.bind(this);
    }
    addVideoToPlaylist(songs, index, playlistId) {
        const headers = {
            Authorization: `Bearer ${sessionStorage.authToken}`
        };
        const body = {
            snippet: {
                playlistId: playlistId,
                position: songs[index].rank - 1,
                resourceId: {
                    videoId: songs[index].videoId,
                    kind: 'youtube#video'
                }
            }
        }
        axios.post(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`, body, { headers })
        .then((res) => {
            console.log(`${songs[index].rank}. ${songs[index].title} was added to the playlist`);
            this.addVideoToPlaylist(songs, index+1, playlistId);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    exportToPlaylist() {
        let chartType = '';
        let classCd = '';
        for (const filter of MelonFilters) {
            // console.log(filter);
            if (filter.chartType === this.props.chart.chartType) {
                chartType = filter.name;
            }
            if (filter.genres) {
                for (const genre of filter.genres) {
                    if (genre.classCd === this.props.chart.classCd) {
                        classCd = genre.name;
                    }
                }
            }
        };
        const body = {
            snippet: {
                title: `멜론 ${chartType} TOP 100 (${classCd}) - ${this.props.chart.updatedMelonDate}`,
                description: 'By Melonizer'
            }
        };
        const headers = {
            Authorization: `Bearer ${sessionStorage.authToken}`
        };

        axios.post(`https://www.googleapis.com/youtube/v3/playlists?part=snippet`, body, { headers })
        .then((res) => {
            this.addVideoToPlaylist(this.props.chart.songs, 0, res.data.id);
        })
        .catch((error) => {
            if (error.response.status === 401) {
                alert("Session Expired, logging out...");
                this.props.logOut();
            }
            if (error.response.status === 403) {
                alert("You may have created too many playlists. Try again later.");
                this.props.logOut();
            }
            console.log(error);
        });
    }
    render() {
        return (
            <div>
                <button onClick={this.exportToPlaylist}>내 유투브 플레이리스트로 보내기</button>
            </div>
        )
    }
}

export default Export;

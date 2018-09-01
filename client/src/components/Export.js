import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

import ExportModal from './ExportModal';

// import '../styles/Export.css';
import MelonFilters from '../melonFilters';

class Export extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exportModalOpen: false,
            exportComplete: 0,
            playlistTitle: '',
            removingVideos: false
        }
        this.getChartTypeClassCdStr = this.getChartTypeClassCdStr.bind(this);
        this.addVideoToPlaylist = this.addVideoToPlaylist.bind(this);
        this.exportToPlaylist = this.exportToPlaylist.bind(this);
        this.removeVideoFromPlaylist = this.removeVideoFromPlaylist.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.checkErrorAndLogOut = this.checkErrorAndLogOut.bind(this);
    }
    getChartTypeClassCdStr() {
        let chartType = '';
        let classCd = '';
        for (const filter of MelonFilters) {
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
        return { chartType, classCd };
    }
    addVideoToPlaylist(index, playlistId) {
        const headers = {
            Authorization: `Bearer ${sessionStorage.authToken}`
        };
        const body = {
            snippet: {
                playlistId: playlistId,
                position: this.props.chart.songs[index].rank - 1,
                resourceId: {
                    videoId: this.props.chart.songs[index].videoId,
                    kind: 'youtube#video'
                }
            }
        }
        axios.post(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`, body, { headers })
        .then((res) => {
            console.log(`${this.props.chart.songs[index].rank}. ${this.props.chart.songs[index].title} was added to the playlist`);
            this.setState({
                exportComplete: this.state.exportComplete + 1
            });
            if (this.props.chart.songs.length - 1 > index) {
                this.addVideoToPlaylist(index+1, playlistId);
            }
            else {
                this.setState({
                    exportComplete: 100
                });
            }
        })
        .catch((error) => {
            this.checkErrorAndLogOut(error);
            console.log(error);
        });
    }
    exportToPlaylist() {
        const { chartType, classCd } = this.getChartTypeClassCdStr();
        const headers = {
            Authorization: `Bearer ${sessionStorage.authToken}`
        };
        const body = {
            snippet: {
                title: this.state.playlistTitle,
                description: 'By Melonizer'
            }
        };
        axios.post(`https://www.googleapis.com/youtube/v3/playlists?part=snippet`, body, { headers })
        .then((res) => {
            this.addVideoToPlaylist(0, res.data.id);
        })
        .catch((error) => {
            this.checkErrorAndLogOut(error);
            console.log(error);
        });
    }
    removeVideoFromPlaylist(playlistId) {
        const headers = {
            Authorization: `Bearer ${sessionStorage.authToken}`
        };
        const params = {
            part: 'snippet',
            maxResults: 1,
            playlistId
        }
        axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, { params, headers })
        .then((res) => {
            if (res.data.items.length > 0) {
                axios.delete(`https://www.googleapis.com/youtube/v3/playlistItems?id=${res.data.items[0].id}`, { headers })
                .then(() => {
                    console.log(`Deleted ${res.data.items[0].snippet.title}`);
                    this.setState({
                        removingVideos: true
                    });
                    this.removeVideoFromPlaylist(playlistId);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else {
                this.setState({
                    removingVideos: false
                });
                const body = {
                    id: playlistId,
                    snippet: {
                        title: this.state.playlistTitle,
                        description: 'By Melonizer'
                    },
                    status: {
                        privacyStatus: 'private'
                    }
                }
                axios.put(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`, body, { headers })
                .then(() => {
                    console.log(`Renamed to ${this.state.playlistTitle}`);
                    this.addVideoToPlaylist(0, playlistId);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        })
        .catch((error) => {
            this.checkErrorAndLogOut(error);
            console.log(error);
        });
    }
    openModal() {
        const { chartType, classCd } = this.getChartTypeClassCdStr();
        this.setState({
            exportModalOpen: true,
            playlistTitle: `멜론 ${chartType} TOP 100 (${classCd}) - ${this.props.chart.updatedMelonDate}`
        });
        if (this.state.exportComplete === 100) {
            this.setState({
                exportComplete: 0
            });
        }
    }
    closeModal() {
        this.setState({exportModalOpen: false});
    }
    checkErrorAndLogOut(error) {
        if (error.response.status === 401) {
            alert('Session Expired, logging out...');
            this.props.logOut();
        }
        if (error.response.status === 403) {
            alert('You may have created too many playlists. Try again later.');
            this.props.logOut();
        }
    }
    render() {
        return (
            <div className='Export'>
                <ExportModal isOpen={this.state.exportModalOpen} open={this.openModal} close={this.closeModal}
                    exportToPlaylist={this.exportToPlaylist} addVideoToPlaylist={this.addVideoToPlaylist}
                    removeVideoFromPlaylist={this.removeVideoFromPlaylist}
                    exportComplete={this.state.exportComplete} removingVideos={this.state.removingVideos}
                    playlistTitle={this.state.playlistTitle}/>
                <Button bsStyle='primary' onClick={this.openModal}>내 유투브 플레이리스트로 보내기</Button>
            </div>
        )
    }
}

export default Export;

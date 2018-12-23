import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, ProgressBar, FormControl } from 'react-bootstrap';

import * as userActions from '../actions/userActions';
import * as exporterActions from '../actions/exporterActions';

import '../styles/Exporter.css';

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
        position: 'absolute',
        top: '100px',
        left: '100px',
        right: '100px',
        bottom: '100px',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px'
    }
};

class Exporter extends React.Component {
    constructor() {
        super();
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.addVideoToPlaylist = this.addVideoToPlaylist.bind(this);
        this.exportToPlaylist = this.exportToPlaylist.bind(this);
        this.removeVideoFromPlaylist = this.removeVideoFromPlaylist.bind(this);
        this.checkErrorAndLogOut = this.checkErrorAndLogOut.bind(this);
        this.export = this.export.bind(this);
    }
    openModal() {
        this.props.dispatch(exporterActions.updateExporter({ exporterModalOpen: true }));
        if (this.props.exporter.exportComplete === 100) {
            this.props.dispatch(exporterActions.updateExporter({ exportComplete: 0 }));
        }
    }
    closeModal() {
        this.props.dispatch(exporterActions.updateExporter({ exporterModalOpen: false }));
    }
    inputHandler(e) {
        this.props.dispatch(exporterActions.updateExporter({ [e.target.name]: e.currentTarget.value }));
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
            this.props.dispatch(exporterActions.updateExporter({ exportComplete: this.props.exporter.exportComplete + 1 }));
            if (this.props.chart.songs.length - 1 > index) {
                this.addVideoToPlaylist(index+1, playlistId);
            }
            else {
                this.props.dispatch(exporterActions.updateExporter({ exportComplete: 100 }));
            }
        })
        .catch((error) => {
            this.checkErrorAndLogOut(error);
            console.log(error);
        });
    }
    exportToPlaylist() {
        const headers = {
            Authorization: `Bearer ${sessionStorage.authToken}`
        };
        const body = {
            snippet: {
                title: this.props.chart.playlistTitle,
                description: 'By MelonList'
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
                    this.props.dispatch(exporterActions.updateExporter({ removingVideos: true }));
                    this.removeVideoFromPlaylist(playlistId);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else {
                this.props.dispatch(exporterActions.updateExporter({ removingVideos: false }));
                const body = {
                    id: playlistId,
                    snippet: {
                        title: this.props.chart.playlistTitle,
                        description: 'By MelonList'
                    },
                    status: {
                        privacyStatus: 'private'
                    }
                }
                axios.put(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`, body, { headers })
                .then(() => {
                    console.log(`Renamed to ${this.props.chart.playlistTitle}`);
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
    checkErrorAndLogOut(error) {
        if (error.response.status === 401) {
            alert('Session Expired, logging out...');
            this.props.dispatch(userActions.logOut());
        }
        if (error.response.status === 403) {
            alert('You may have created too many playlists. Try again later.');
            this.props.dispatch(userActions.logOut());
        }
    }
    export() {
        if (this.props.exporter.exportType === 'new') {
            this.exportToPlaylist();
        }
        else if (this.props.exporter.exportType === 'existing') {
            const regexPlaylist = /^PL[a-zA-Z0-9_]{16,32}$/;
            if (regexPlaylist.test(this.props.exporter.playlistId)) {
                this.props.dispatch(exporterActions.updateExporter({ exportStatus: '' }));
                if (this.props.exporter.existingType === 'reset') {
                    this.removeVideoFromPlaylist(this.props.exporter.playlistId);
                }
                else if (this.props.exporter.existingType === 'prepend') {
                    this.addVideoToPlaylist(0, this.props.exporter.playlistId)
                }
            }
            else {
                this.props.dispatch(exporterActions.updateExporter({ exportStatus: '플레이리스트 아이디가 존재하지 않습니다.' }));
            }
        }
    }
    componentWillMount() {
        Modal.setAppElement('body');
    }
    render() {
        return (
            <div className='Exporter'>
                <Modal className='column-center'
                    isOpen={this.props.exporter.exporterModalOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}>
                    <h1>유투브 플레이리스트로 보내기</h1>
                    <div>새로운 플레이리스트 제목: {this.props.chart.playlistTitle}</div>
                    <div className='section'>
                        <label>
                            <input type='radio' name='exportType' value='new'
                                onChange={this.inputHandler} checked={this.props.exporter.exportType === 'new'}/>
                                새로운 플레이리스트로 보내기 (주의: 제한 넘길시 24시간 동안 생성 불가)
                        </label>
                    </div>
                    <div className='section'>
                        <label>
                            <input type='radio' name='exportType' value='existing'
                                onChange={this.inputHandler} checked={this.props.exporter.exportType === 'existing'}/>
                                생성된 플레이리스트로 보내기 (위 방법이 안될시 유투브에서 직접 생성 후 추가):
                        </label>
                    </div>
                    <div className='column-center section'>
                        <div>플레이리스트 아이디</div>
                        <div>예) https://www.youtube.com/playlist?list=<b>PLkf04U4YkwwrjRvmY1wMtHQM5</b></div>
                        <FormControl type='text' name='playlistId'
                            onChange={this.inputHandler} placeholder='PLkf04U4YkwwrjRvmY1wMtHQM5'
                            disabled={this.props.exporter.exportType === 'new'}/>
                        <div>
                            <div>
                                <label>
                                    <input type='radio' name='existingType' value='reset'
                                        onChange={this.inputHandler} checked={this.props.exporter.existingType === 'reset'}
                                        disabled={this.props.exporter.exportType === 'new'}/>
                                    해당 플레이리스트 비디오 모두 제거 후 보내기 (위 제목으로 변경)
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type='radio' name='existingType' value='prepend'
                                    onChange={this.inputHandler} checked={this.props.exporter.existingType === 'prepend'}
                                        disabled={this.props.exporter.exportType === 'new'}/>
                                    해당 플레이리스트 비디오 유지. 모든 비디오 앞으로 보내기
                                </label>
                            </div>
                        </div>
                    </div>
                    <Button className='section wide' bsStyle='primary' onClick={this.export}>보내기</Button>
                    <ProgressBar className='section wide' bsStyle='success' label={this.props.exporter.exportComplete > 0 ? 'Exporting' : (this.props.exporter.removingVideos ? 'Deleting': '')}
                        active now={this.props.exporter.exportComplete || (this.props.exporter.removingVideos ? 100 : 0)}/>
                    {this.props.exporter.exportComplete === 100 ? <div>완료!</div> : <div>{this.props.exporter.exportStatus}</div>}
                </Modal>
                <Button bsStyle='primary' onClick={this.openModal}>내 유투브 플레이리스트로 보내기</Button>
            </div>
        )
    }
}


const mapStateToProps = (store) => {
    return {
        chart: store.chart,
        exporter: store.exporter
    };
}

export default connect(mapStateToProps)(Exporter);

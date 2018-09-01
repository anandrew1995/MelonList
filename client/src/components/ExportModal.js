import React from 'react';
import Modal from 'react-modal';
import { Button, ProgressBar, FormControl } from 'react-bootstrap';

import '../styles/ExportModal.css';

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

class ExportModal extends React.Component {
    constructor() {
        super();
        this.state = {
            chartType: '',
            classCd: '',
            exportType: 'new',
            existingType: 'reset',
            playlistId: '',
            exportStatus: ''
        };
        this.setExportType = this.setExportType.bind(this);
        this.setExistingType = this.setExistingType.bind(this);
        this.setPlaylistId = this.setPlaylistId.bind(this);
        this.export = this.export.bind(this);
    }
    setExportType(e) {
        this.setState({
            exportType: e.currentTarget.value
        });
    }
    setExistingType(e) {
        this.setState({
            existingType: e.currentTarget.value
        });
    }
    setPlaylistId(e) {
        this.setState({
            playlistId: e.currentTarget.value
        });
    }
    export() {
        if (this.state.exportType === 'new') {
            this.props.exportToPlaylist();
        }
        else if (this.state.exportType === 'existing') {
            const regexPlaylist = /^PL[a-zA-Z0-9]{16,32}$/;
            if (regexPlaylist.test(this.state.playlistId)) {
                this.setState({
                    exportStatus: ''
                });
                if (this.state.existingType === 'reset') {
                    this.props.removeVideoFromPlaylist(this.state.playlistId);
                }
                else if (this.state.existingType === 'prepend') {
                    this.props.addVideoToPlaylist(0, this.state.playlistId)
                }
            }
            else {
                this.setState({
                    exportStatus: '플레이리스트 아이디가 존재하지 않습니다.'
                });
            }
        }
    }
    componentWillMount() {
        Modal.setAppElement('body');
    }
    render() {
        return (
            <Modal className='column-center'
                isOpen={this.props.isOpen}
                onRequestClose={this.props.close}
                style={customStyles}>
                <h1>유투브 플레이리스트로 보내기</h1>
                <div>새로운 플레이리스트 제목: {this.props.playlistTitle}</div>
                <div className='section'>
                    <label>
                        <input type='radio' name='exportType' value='new'
                            onChange={this.setExportType} checked={this.state.exportType === 'new'}/>
                            새로운 플레이리스트로 보내기 (주의: 제한 넘길시 24시간 동안 생성 불가)
                    </label>
                </div>
                <div className='section'>
                    <label>
                        <input type='radio' name='exportType' value='existing'
                            onChange={this.setExportType} checked={this.state.exportType === 'existing'}/>
                            생성된 플레이리스트로 보내기 (위 방법이 안될시 유투브에서 직접 생성 후 추가):
                    </label>
                </div>
                <div className='column-center section'>
                    <div>플레이리스트 아이디</div>
                    <div>예) https://www.youtube.com/playlist?list=<b>PLkf04U4YkwwrjRvmY1wMtHQM5</b></div>
                    <FormControl type='text' name='playlistId'
                        onChange={this.setPlaylistId} placeholder='PLkf04U4YkwwrjRvmY1wMtHQM5'
                        disabled={this.state.exportType === 'new'}/>
                    <div>
                        <div>
                            <label>
                                <input type='radio' name='existingType' value='reset'
                                    onChange={this.setExistingType} checked={this.state.existingType === 'reset'}
                                    disabled={this.state.exportType === 'new'}/>
                                해당 플레이리스트 비디오 모두 제거 후 보내기 (위 제목으로 변경)
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type='radio' name='existingType' value='prepend'
                                onChange={this.setExistingType} checked={this.state.existingType === 'prepend'}
                                    disabled={this.state.exportType === 'new'}/>
                                해당 플레이리스트 비디오 유지. 모든 비디오 앞으로 보내기
                            </label>
                        </div>
                    </div>
                </div>
                <Button className='section wide' bsStyle='primary' onClick={this.export}>보내기</Button>
                <ProgressBar className='section wide' bsStyle='success' label={this.props.exportComplete > 0 ? 'Exporting' : (this.props.removingVideos ? 'Deleting': '')}
                    active now={this.props.exportComplete || (this.props.removingVideos ? 100 : 0)}/>
                {this.props.exportComplete === 100 ? <div>완료!</div> : <div>{this.state.exportStatus}</div>}
            </Modal>
        )
    }
}

export default ExportModal;

export default function reducer(state = {
    exporterModalOpen: false,
    exportComplete: 0,
    removingVideos: false,
    exportType: 'new',
    existingType: 'reset',
    playlistId: '',
    exportStatus: ''
}, action) {
    switch(action.type) {
        case 'UPDATE_EXPORTER':
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default function reducer(state = {
    chartType: 'month',
    classCd: 'GN0000',
    playlistTitle: '',
    songs: [],
    updatedDate: '',
    retrievedDate: ''
}, action) {
    switch(action.type) {
        case 'UPDATE_CHART':
            return {
                ...state,
                ...action.payload
            };
        case 'CLEAR_CHART':
            return {
                ...state,
                songs: [],
                updatedDate: '',
                retrievedDate: ''
            }
        default:
            return state;
    }
}

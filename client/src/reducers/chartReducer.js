export default function reducer(state = {
    chartType: 'month',
    classCd: 'GN0000',
    playlistTitle: '',
    songs: [],
    chartDate: '',
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
                chartDate: '',
                retrievedDate: ''
            }
        default:
            return state;
    }
}

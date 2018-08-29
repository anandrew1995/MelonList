export default function reducer (state = {
    chart: {},
    chartType: 'month',
    classCd: 'GN0000',
    loggedIn: false
}, action) {
    switch (action.type) {
        case "CLEAR_CHART":
            return {
                ...state,
                chart: {
                    songs: [],
                    retrievedMelonDate: '',
                    updatedMelonDate: '',
                }
            }
        case "FETCH_CHART_SUCCESS":
            return {
                ...state,
                chart: action.payload.chart
            }
        default:
            return state;
    }
}

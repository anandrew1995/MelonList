import axios from 'axios';

export function updateChart(chartType, classCd) {
    return (dispatch) => {
        dispatch({ type: "CLEAR_CHART", payload: {} });
        axios.get('/api/charts', { params: { chartType, classCd } })
        .then((res) => {
            console.log(res.data);
            dispatch({type: "FETCH_CHART_SUCCESS", payload: { chart: res.data }});
        })
        .catch((error) => {
            dispatch({type: "FETCH_CHART_FAILED", payload: error});
        });
    }
}

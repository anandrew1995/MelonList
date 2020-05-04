import axios from "axios";

import { getServerHost } from "lib";

import MelonFilters from "melonFilters";

export function updateChart(chart) {
	return {
		type: "UPDATE_CHART",
		payload: chart,
	};
}

export function clearChart() {
	return {
		type: "CLEAR_CHART",
	};
}

export function fetchChart(chartType, classCd) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_CHART" });
		axios
			.get(`${getServerHost()}/api/charts`, {
				params: { chartType, classCd },
			})
			.then((res) => {
				let chartTypeConverted = "";
				let classCdConverted = "";
				for (const filter of MelonFilters) {
					if (filter.chartType === chartType) {
						chartTypeConverted = filter.name;
					}
					if (filter.genres) {
						for (const genre of filter.genres) {
							if (genre.classCd === classCd) {
								classCdConverted = genre.name;
							}
						}
					}
				}
				dispatch({
					type: "UPDATE_CHART",
					payload: {
						...res.data,
						playlistTitle: `멜론 ${chartTypeConverted} TOP 100 (${classCdConverted}) - ${res.data.chartDate}`,
					},
				});
			})
			.catch((error) => {
				console.error(error);
			});
	};
}

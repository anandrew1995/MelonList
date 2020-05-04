import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { getServerHost } from "lib";

const Downloader = () => {
	const chart = useSelector((store) => store.chart);
	const downloadYoutube = () => {
		const body = {
			playlistTitle: chart.playlistTitle,
			songs: chart.songs,
		};
		axios
			.post(`${getServerHost()}/api/charts/download`, body)
			.then((res) => {
				console.log(res.data);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div className="Downloader">
			<button onClick={downloadYoutube}>Download</button>
		</div>
	);
};

export default Downloader;

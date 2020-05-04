import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./Chart.css";

import * as chartActions from "actions/chartActions";

const Chart = () => {
	const chart = useSelector((store) => store.chart);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(chartActions.fetchChart(chart.chartType, chart.classCd));
	}, []);

	return (
		<div className="Chart">
			{chart.songs.length > 0 ? (
				<div className="table">
					<div className="tableTitle">{chart.playlistTitle}</div>
					<table>
						<tbody>
							<tr>
								<th>순위</th>
								<th>제목</th>
								<th>가수</th>
								<th>유투브 링크</th>
							</tr>
							{chart.songs.map((song) => {
								const videoLength = song.videoTitle.length;
								const shortVideoTitle = song.videoTitle.substr(
									0,
									20
								);
								return (
									<tr key={song.rank}>
										<td>{song.rank}</td>
										<td>{song.title}</td>
										<td>{song.artist}</td>
										<td>
											<a
												href={`https://www.youtube.com/watch?v="${song.videoId}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{videoLength > 20
													? `${shortVideoTitle}...`
													: song.videoTitle}
											</a>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : (
				<div>로딩중...</div>
			)}
			{chart.retrievedDate ? (
				<div>차트 업데이트: {chart.retrievedDate}</div>
			) : null}
		</div>
	);
};

export default Chart;

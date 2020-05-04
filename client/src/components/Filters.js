import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";

import Exporter from "components/Exporter";

import * as chartActions from "actions/chartActions";

import MelonFilters from "melonFilters";
import "./Filters.css";

const Filters = () => {
	const chart = useSelector((store) => store.chart);
	const user = useSelector((store) => store.user);
	const dispatch = useDispatch();
	const retrieveChart = () => {
		dispatch(chartActions.fetchChart(chart.chartType, chart.classCd));
	};
	const inputHandler = (e) => {
		dispatch(
			chartActions.updateChart({ [e.target.name]: e.currentTarget.value })
		);
	};

	return (
		<div className="Filters">
			<div className="filter">
				<div className="filterName">차트 기간</div>
				<div>
					{MelonFilters.filter((filter) =>
						filter.hasOwnProperty("chartType")
					).map((period) => (
						<div className="filterItem" key={period.chartType}>
							<label>
								<input
									type="radio"
									name="chartType"
									value={period.chartType}
									checked={
										period.chartType === chart.chartType
									}
									onChange={inputHandler}
								/>
								{period.name}
							</label>
						</div>
					))}
				</div>
			</div>
			<div className="line"></div>
			{MelonFilters.filter((filter) =>
				filter.hasOwnProperty("genres")
			).map((filterType) => (
				<div className="filter" key={filterType.name}>
					<div className="filterName">{filterType.name}</div>
					<div>
						{filterType.genres.map((filter) => (
							<div className="filterItem" key={filter.classCd}>
								<label>
									<input
										type="radio"
										name="classCd"
										value={filter.classCd}
										checked={
											filter.classCd === chart.classCd
										}
										onChange={inputHandler}
									/>
									{filter.name}
								</label>
							</div>
						))}
					</div>
				</div>
			))}
			<div className="buttons">
				<Button variant="info" onClick={retrieveChart}>
					불러오기
				</Button>
				{user.loggedIn ? <Exporter /> : null}
			</div>
		</div>
	);
};

export default Filters;

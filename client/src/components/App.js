import React from "react";

import "../styles/App.css";

import Login from "./Login";
import Filters from "./Filters";
import Chart from "./Chart";
// import Downloader from "./Downloader";
import CertificateMessage from "./CertificateMessage";

import favicon from "../images/favicon.png";

const App = () => (
	<div className="App">
		<div className="header">
			<div className="logo">
				<img src={favicon} alt="melon" />
				<h1>MelonList</h1>
				<img src={favicon} alt="melon" />
			</div>
			<Login />
		</div>
		{/* <Downloader /> */}
		<CertificateMessage />
		<h2>멜론 TOP 100</h2>
		<Filters />
		<Chart />
	</div>
);

export default App;

import React from "react";

import "./App.css";

import Login from "components/Login";
import Filters from "components/Filters";
import Chart from "components/Chart";
// import Downloader from "components/Downloader";
import CertificateMessage from "components/CertificateMessage";

import favicon from "images/favicon.png";

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

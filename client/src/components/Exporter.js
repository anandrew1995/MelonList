import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import axios from "axios";
import { Button, ProgressBar, FormControl } from "react-bootstrap";

import * as userActions from "actions/userActions";
import * as exporterActions from "actions/exporterActions";

import "./Exporter.css";

const customStyles = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(255, 255, 255, 0.75)",
	},
	content: {
		position: "absolute",
		top: "100px",
		left: "100px",
		right: "100px",
		bottom: "100px",
		border: "1px solid #ccc",
		background: "#fff",
		overflow: "auto",
		WebkitOverflowScrolling: "touch",
		borderRadius: "4px",
		outline: "none",
		padding: "20px",
	},
};

const Exporter = () => {
	const chart = useSelector((store) => store.chart);
	const exporter = useSelector((store) => store.exporter);
	const dispatch = useDispatch();
	useEffect(() => {
		Modal.setAppElement("body");
	}, []);
	const openModal = () => {
		dispatch(exporterActions.updateExporter({ exporterModalOpen: true }));
		if (exporter.exportComplete === 100) {
			dispatch(exporterActions.updateExporter({ exportComplete: 0 }));
		}
	};
	const closeModal = () => {
		dispatch(exporterActions.updateExporter({ exporterModalOpen: false }));
	};
	const inputHandler = (e) => {
		dispatch(
			exporterActions.updateExporter({
				[e.target.name]: e.currentTarget.value,
			})
		);
	};
	const addVideoToPlaylist = (index, playlistId) => {
		const headers = {
			Authorization: `Bearer ${sessionStorage.authToken}`,
		};
		const body = {
			snippet: {
				playlistId: playlistId,
				position: chart.songs[index].rank - 1,
				resourceId: {
					videoId: chart.songs[index].videoId,
					kind: "youtube#video",
				},
			},
		};
		axios
			.post(
				`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`,
				body,
				{ headers }
			)
			.then((res) => {
				console.log(
					`${chart.songs[index].rank}. ${chart.songs[index].title} was added to the playlist`
				);
				dispatch(
					exporterActions.updateExporter({
						exportComplete: exporter.exportComplete + 1,
					})
				);
				if (chart.songs.length - 1 > index) {
					addVideoToPlaylist(index + 1, playlistId);
				} else {
					dispatch(
						exporterActions.updateExporter({ exportComplete: 100 })
					);
				}
			})
			.catch((error) => {
				checkErrorAndLogOut(error);
				console.error(error);
			});
	};
	const exportToPlaylist = () => {
		const headers = {
			Authorization: `Bearer ${sessionStorage.authToken}`,
		};
		const body = {
			snippet: {
				title: chart.playlistTitle,
				description: "By MelonList",
			},
		};
		axios
			.post(
				`https://www.googleapis.com/youtube/v3/playlists?part=snippet`,
				body,
				{ headers }
			)
			.then((res) => {
				addVideoToPlaylist(0, res.data.id);
			})
			.catch((error) => {
				checkErrorAndLogOut(error);
				console.error(error);
			});
	};
	const removeVideoFromPlaylist = (playlistId) => {
		const headers = {
			Authorization: `Bearer ${sessionStorage.authToken}`,
		};
		const params = {
			part: "snippet",
			maxResults: 1,
			playlistId,
		};
		axios
			.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
				params,
				headers,
			})
			.then((res) => {
				if (res.data.items.length > 0) {
					axios
						.delete(
							`https://www.googleapis.com/youtube/v3/playlistItems?id=${res.data.items[0].id}`,
							{ headers }
						)
						.then(() => {
							console.log(
								`Deleted ${res.data.items[0].snippet.title}`
							);
							dispatch(
								exporterActions.updateExporter({
									removingVideos: true,
								})
							);
							removeVideoFromPlaylist(playlistId);
						})
						.catch((error) => {
							console.error(error);
						});
				} else {
					dispatch(
						exporterActions.updateExporter({
							removingVideos: false,
						})
					);
					const body = {
						id: playlistId,
						snippet: {
							title: chart.playlistTitle,
							description: "By MelonList",
						},
						status: {
							privacyStatus: "private",
						},
					};
					axios
						.put(
							`https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`,
							body,
							{ headers }
						)
						.then(() => {
							console.log(`Renamed to ${chart.playlistTitle}`);
							addVideoToPlaylist(0, playlistId);
						})
						.catch((error) => {
							console.error(error);
						});
				}
			})
			.catch((error) => {
				checkErrorAndLogOut(error);
				console.error(error);
			});
	};
	const checkErrorAndLogOut = (error) => {
		if (error.response.status === 401) {
			alert("Session Expired, logging out...");
			dispatch(userActions.logOut());
		}
		if (error.response.status === 403) {
			alert("You may have created too many playlists. Try again later.");
			dispatch(userActions.logOut());
		}
	};
	const exportPlaylist = () => {
		if (exporter.exportType === "new") {
			exportToPlaylist();
		} else if (exporter.exportType === "existing") {
			const regexPlaylist = /^PL[a-zA-Z0-9_]{16,32}$/;
			if (regexPlaylist.test(exporter.playlistId)) {
				dispatch(exporterActions.updateExporter({ exportStatus: "" }));
				if (exporter.existingType === "reset") {
					removeVideoFromPlaylist(exporter.playlistId);
				} else if (exporter.existingType === "prepend") {
					addVideoToPlaylist(0, exporter.playlistId);
				}
			} else {
				dispatch(
					exporterActions.updateExporter({
						exportStatus:
							"플레이리스트 아이디가 존재하지 않습니다.",
					})
				);
			}
		}
	};

	return (
		<div className="Exporter">
			<Modal
				className="column-center"
				isOpen={exporter.exporterModalOpen}
				onRequestClose={closeModal}
				style={customStyles}
			>
				<h1>유투브 플레이리스트로 보내기</h1>
				<div>새로운 플레이리스트 제목: {chart.playlistTitle}</div>
				<div className="section">
					<label>
						<input
							type="radio"
							name="exportType"
							value="new"
							onChange={inputHandler}
							checked={exporter.exportType === "new"}
						/>
						새로운 플레이리스트로 보내기 (주의: 제한 넘길시 24시간
						동안 생성 불가)
					</label>
				</div>
				<div className="section">
					<label>
						<input
							type="radio"
							name="exportType"
							value="existing"
							onChange={inputHandler}
							checked={exporter.exportType === "existing"}
						/>
						생성된 플레이리스트로 보내기 (위 방법이 안될시
						유투브에서 직접 생성 후 추가):
					</label>
				</div>
				<div className="column-center section">
					<div>플레이리스트 아이디</div>
					<div>
						예) https://www.youtube.com/playlist?list=
						<b>PLkf04U4YkwwrjRvmY1wMtHQM5</b>
					</div>
					<FormControl
						type="text"
						name="playlistId"
						onChange={inputHandler}
						placeholder="PLkf04U4YkwwrjRvmY1wMtHQM5"
						disabled={exporter.exportType === "new"}
					/>
					<div>
						<div>
							<label>
								<input
									type="radio"
									name="existingType"
									value="reset"
									onChange={inputHandler}
									checked={exporter.existingType === "reset"}
									disabled={exporter.exportType === "new"}
								/>
								해당 플레이리스트 비디오 모두 제거 후 보내기 (위
								제목으로 변경)
							</label>
						</div>
						<div>
							<label>
								<input
									type="radio"
									name="existingType"
									value="prepend"
									onChange={inputHandler}
									checked={
										exporter.existingType === "prepend"
									}
									disabled={exporter.exportType === "new"}
								/>
								해당 플레이리스트 비디오 유지. 모든 비디오
								앞으로 보내기
							</label>
						</div>
					</div>
				</div>
				<Button
					className="section wide"
					variant="primary"
					onClick={exportPlaylist}
				>
					보내기
				</Button>
				<ProgressBar
					className="section wide"
					variant="success"
					label={
						exporter.exportComplete > 0
							? "Exporting"
							: exporter.removingVideos
							? "Deleting"
							: ""
					}
					active
					now={
						exporter.exportComplete ||
						(exporter.removingVideos ? 100 : 0)
					}
				/>
				{exporter.exportComplete === 100 ? (
					<div>완료!</div>
				) : (
					<div>{exporter.exportStatus}</div>
				)}
			</Modal>
			<Button variant="primary" onClick={openModal}>
				내 유투브 플레이리스트로 보내기
			</Button>
		</div>
	);
};

export default Exporter;

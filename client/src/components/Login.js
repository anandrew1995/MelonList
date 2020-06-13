import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Button } from "react-bootstrap";

import config from "../config";
import "../styles/Login.css";

import * as userActions from "../actions/userActions";

import signInImg from "../images/btn_google_signin_dark_normal_web@2x.png";

const scopes = ["https://www.googleapis.com/auth/youtube"];
const signInUrl =
	`https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&` +
	`redirect_uri=${config.redirectUri}&response_type=token&` +
	`scope=${scopes.join(" ")}`;

const Login = () => {
	const user = useSelector((store) => store.user);
	const dispatch = useDispatch();
	useEffect(() => {
		const getUser = async () => {
			if (window.location.href.includes("#access_token")) {
				const tokenObj = parseAuthCode(window.location.href);
				const tokenInfo = await axios.get(
					`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${tokenObj.access_token}`
				);
				if (tokenInfo.data.aud === config.clientId) {
					dispatch(
						userActions.updateUser({
							authToken: tokenObj.access_token,
							loggedIn: true,
						})
					);
					const userInfo = await axios.get(
						"https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
						{
							headers: {
								Authorization: `Bearer ${user.authToken}`,
							},
						}
					);
					dispatch(
						userActions.updateUser({
							name: userInfo.data.items[0].snippet.title,
						})
					);
					window.location.hash = "";
				}
			}
			if (sessionStorage.loggedIn) {
				dispatch(
					userActions.updateUser({
						name: sessionStorage.name,
						authToken: sessionStorage.authToken,
						loggedIn: true,
					})
				);
			}
		};
		getUser();
	}, []);
	const openGoogleOAuth = () => {
		window.location = signInUrl;
	};
	const parseAuthCode = (url) => {
		const route = url.substring(url.indexOf("callback"));
		const queries = route.split("&");
		return {
			access_token: queries[0].split("=")[1],
			token_type: queries[1].split("=")[1],
			expires_in: queries[2].split("=")[1],
		};
	};
	const logOut = () => {
		dispatch(userActions.logOut());
	};

	return (
		<div className="Login">
			{user.loggedIn ? (
				<Button variant="warning" onClick={logOut}>
					{user.name}, 로그아웃
				</Button>
			) : (
				<img
					onClick={openGoogleOAuth}
					alt="btn_google_signin_dark_normal_web@2x.png"
					src={signInImg}
				></img>
			)}
		</div>
	);
};

export default Login;

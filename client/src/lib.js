import config from "../src/config.json";

export const getServerHost = () => {
	const isOnGithub = window.location.href.includes("github.io");
	if (process.env.NODE_ENV === "development" || isOnGithub) {
		return config.serverHost;
	}
	return "";
};

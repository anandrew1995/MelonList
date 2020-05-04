import config from "../src/config.json";

export const getServerHost = () => {
	if (
		process.env.NODE_ENV === "development" ||
		config.onGithubPages === true
	) {
		return config.serverHost;
	}
	return "";
};

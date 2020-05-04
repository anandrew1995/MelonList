import config from "config.json";

export const getServerHost = () => {
	if (process.env.NODE_ENV === "development") {
		return config.serverHost;
	}
	return "";
};

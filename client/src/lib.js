import config from "./config";

export const getServerHost = () => {
	if (process.env.NODE_ENV === "development") {
		return config.serverHost;
	}
	return "";
};

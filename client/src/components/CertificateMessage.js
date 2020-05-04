import React from "react";

import config from "../config";

const CertificateMessage = () => (
	<div style={{ marginBottom: "20px" }}>
		<a href={config.serverHost} target="_blank" rel="noopener noreferrer">
			If the page is not responding, click here and accept the self-signed
			certificate.
		</a>
	</div>
);

export default CertificateMessage;

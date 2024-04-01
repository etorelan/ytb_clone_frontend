import React from "react";
import EyeCatcher from "../EyeCatcher";
import { defaultStyles } from "../EyeCatcherDefaults";

const divStyle = {
	maxWidth: "900px",
	width: "100%",
};

export default function EyeCatcherWrapped({
	videoId,
	customStyles = defaultStyles,
}) {
	return (
		<div style={divStyle}>
			<EyeCatcher key={videoId} videoId={videoId} styles={customStyles} />
		</div>
	);
}

import React from "react";
import { useParams } from "react-router-dom";
import { API_ROUTE } from "../../utils/AuthContext";

const styles = {
	video: {
		maxWidth: "100%",
		width: "100%",
		maxHeight: "711px",
	},
};

export default function VideoFrame() {
	const { videoId } = useParams();

	return (
		<video controls muted style={styles.video}>
			<source src={API_ROUTE + videoId} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
}

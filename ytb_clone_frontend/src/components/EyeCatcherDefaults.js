import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TextEllipsis } from "./TextEllipsis";

export const defaultStyles = {
	topBox: {
		width: "100%",
		display: "flex",
		marginBottom: "10px",
	},
	thumbnail: {
		borderRadius: "10px",
		height: "94px",
		width: "168px",
	},
	videoText: {
		marginLeft: "7px",
	},
	title: {
		marginLeft: "5px",
		fontSize: 14,
	},
	channelName: {
		color: "#aaaaaa",
	},
	viewsNTimeAgoDiv: {
		display: "flex",
	},
	viewsNTimeAgo: {
		wordBreak: "break-word",
		color: "#aaaaaa",
	},
};

export function EyeSetup(setComponentWidth) {
	const updateComponentWidth = () => {
		const width = document.getElementById("component").offsetWidth;
		setComponentWidth(width);
	};

	window.addEventListener("resize", updateComponentWidth);
	updateComponentWidth();
	return () => {
		window.removeEventListener("resize", updateComponentWidth);
	};
}

export function EyeText({
	objInfo,
	componentWidth,
	styles = defaultStyles,
	last,
}) {
	return (
		<Stack id="component" direction="column" sx={styles.videoText}>
			<TextEllipsis
				id="component"
				text={objInfo.title}
				componentWidth={componentWidth}
				fontSize={styles.title.fontSize}
				fontWeight={styles.title.fontWeight}
			/>

			{objInfo.channelName === undefined ? (
				<div />
			) : (
				<Typography variant="caption" sx={styles.channelName}>
					{objInfo.channelName}
				</Typography>
			)}
			{last}
		</Stack>
	);
}

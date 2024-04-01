import React, { useContext } from "react";
import { Stack } from "@mui/material";
import VideoFrame from "./VideoFrame";
import VideoInfo from "./VideoInfo";
import CommentSection from "./Comment/CommentSection";
import { breakPointTheme } from "../../pages/VideoPage";
import { VideoContext } from "./VideoContext";


export default function VideoMain() {
	const { hasScrolledOrZoomedOut, windowWidth, videoInfo } =
		useContext(VideoContext);

	return (
		<Stack sx={{ maxWidth: "100%", width: "100%" }}>
			<VideoFrame />
			<VideoInfo />

			{hasScrolledOrZoomedOut &&
			windowWidth >= breakPointTheme.breakpoints.values.lg ? (
				<CommentSection />
			) : (
				<h6 style={{ display: "none" }} />
			)}
		</Stack>
	);
}

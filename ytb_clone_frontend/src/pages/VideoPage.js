import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { Grid, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import VideoMain from "../components/VideoPageComps/VideoMain";
import CommentSection from "../components/VideoPageComps/Comment/CommentSection";
import { initializeEyeCatcher } from "../helpfulFunctions";
import { useParams } from "react-router-dom";
import { VideoContext } from "../components/VideoPageComps/VideoContext";
import Loading from "../components/Loading";
import InfiniteScrollSidebar from "../components/VideoPageComps/InfiniteScroll/InfiniteScrollSidebar";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../firebase_files/Config";

const styles = {
	topBox: {
		flexGrow: 1,
		pr: "20px",
	},
	sideBar: {
		minWidth: "300px",
		maxHeight: "40px",
		// ml: "34px",
		marginLeft: "0px",
	},
};

export const breakPointTheme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1071,
			xl: 1536,
		},
	},
});

export default function VideoPage() {
	const { videoId } = useParams();
	const { videoInfo, windowWidth, setVideoInfo, setHasScrolledOrZoomedOut, setWindowWidth } = useContext(VideoContext);

	const [loading, setLoading] = useState(true);

	const SCROLL_THRESHOLD = 20;

	useEffect(() => {
		initializeEyeCatcher(videoId, setVideoInfo, setLoading);
		const videoRef = doc(db, "videos", videoId);
		updateDoc(videoRef, { views: increment(1) });

		const handleScroll = () => {
			const scrollPosition = window.scrollY || document.documentElement.scrollTop;
			if (scrollPosition >= SCROLL_THRESHOLD) {
				setHasScrolledOrZoomedOut(true);
			}
		};

		const handleResize = () => {
			const zoomFactor = window.innerWidth / window.outerWidth;
			setWindowWidth(window.innerWidth);
			if (zoomFactor < 1) {
				setHasScrolledOrZoomedOut(true);
			}
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	if (loading) return <Loading />;

	return (
		<Box sx={styles.topBox}>
			<ThemeProvider theme={breakPointTheme}>
				<Grid container spacing={2}>
					<Grid item className="d-none d-xxl-block d-xl-block" xl={0.48} />

					<Grid item xs={12} lg={8}>
						<VideoMain />
					</Grid>

					<Grid item xs={11} lg={3.6} xl={3} sx={{ ...styles.sideBar }}>
						<InfiniteScrollSidebar windowWidth={windowWidth}/>

						{windowWidth < breakPointTheme.breakpoints.values.lg ? <CommentSection videoInfo={videoInfo} /> : <div></div>}
					</Grid>
				</Grid>
			</ThemeProvider>
		</Box>
	);
}

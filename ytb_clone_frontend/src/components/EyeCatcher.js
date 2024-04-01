import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { API_ROUTE } from "../utils/AuthContext";
import { initializeEyeCatcher } from "../helpfulFunctions";
import { Link } from "react-router-dom";
import LoadingEyeCatcher from "./VideoPageComps/LoadingEyeCatcher";

import { EyeSetup, EyeText } from "./EyeCatcherDefaults";
import { defaultStyles } from "./EyeCatcherDefaults";


export default function EyeCatcher({ videoId, styles=defaultStyles}) {
	const [videoInfo, setVideoInfo] = useState({});
	const [componentWidth, setComponentWidth] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		initializeEyeCatcher(videoId, setVideoInfo, setLoading);
		return EyeSetup(setComponentWidth);
	}, []);

	return (
		<div>
			{loading ? (
				<LoadingEyeCatcher />
			) : (
				<Link reloadDocument to={"/videos/" + videoId.toString()}>
					<Box sx={styles.topBox}>
						<img
							style={styles.thumbnail}
							src={API_ROUTE + videoInfo.thumbnail}
							alt="Thumbnail"
						/>

						<EyeText
							objInfo={videoInfo}
							componentWidth={componentWidth}
							styles={styles}
							last={
								<div style={styles.viewsNTimeAgo}>
									<Typography
										variant="caption"
										noWrap={true}
										sx={styles.viewsNTimeAgo}>
										{videoInfo.views} • {videoInfo.timeAgo}
									</Typography>
								</div>
							}
							/>
					</Box>
				</Link>
			)}
		</div>
	);
}

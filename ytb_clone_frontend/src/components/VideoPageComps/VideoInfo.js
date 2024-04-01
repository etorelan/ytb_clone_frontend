import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { getUserInfo, roundNumber } from "../../helpfulFunctions";
import { TextEllipsis } from "../TextEllipsis";
import LoadingEyeCatcher from "./LoadingEyeCatcher";
import LikeButtons from "./VideoLikeButtons";
import VideoDescription from "./VideoDescription";
import { Link } from "react-router-dom";
import { VideoContext } from "./VideoContext";
import { API_ROUTE, AuthContext } from "../../utils/AuthContext";
import { INDEX_USER_INFO_SUBS } from "../../helpfulFunctions";

export const plainTextButtonStyles = {
	textTransform: "none",
	fontWeight: "normal",
	fontStyle: "normal",
	textDecoration: "none",
	backgroundColor: "#f1f1f1",
	color: "black",
	borderRadius: "30px",
	width: "94.5px",
	minWidth: "94.5px",
	height: "36px",
	marginLeft: "20px",
};

const styles = {
	topBox: {
		marginTop: "15px",
	},
	channelNLike: {
		alignItems: "center",
		marginTop: "5px",
		display: "flex",
		flexWrap: "wrap",
	},
	userPhoto: {
		borderRadius: "50px",
		height: "40px",
		width: "40px",
	},
	nameSubCount: {
		marginLeft: "10px",
	},
	subCountDiv: {
		display: "flex",
	},
	subCount: {
		wordBreak: "break-word",
		color: "#aaaaaa",
	},
	likes: {
		textAlign: "right",
		float: "right",
		display: "flex",
		marginLeft: "auto",
		overflow: "wrap",
	},
};

export function SubscribeButton({ style = plainTextButtonStyles, channelId }) {
	const { user } = useContext(AuthContext);
	const [subscriptions, setSubscriptions] = useState();
	const [initIsSubscribed, setInitIsSubscribed] = useState();
	const [isSubscribed, setIsSubscribed] = useState();

	const navigate = useNavigate();

	const handleButtonClick = async () => {
		if (!user) navigate("/login");
		else {
			try {
				const newSubsArray = await getUserInfo(user.uid);
				setSubscriptions(newSubsArray[INDEX_USER_INFO_SUBS]);
			} catch (error) {
				throw new Error(error);
			}
		}
	};

	useEffect(() => {
		async function update() {
			try {
				user.getIdToken().then(function (token) {
					fetch(API_ROUTE + "subscribe", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: token,
						},
						body: JSON.stringify({ userId: user.uid, channelId: channelId }),
					});
				});

				setIsSubscribed(!isSubscribed);
			} catch (error) {
				throw new Error(error);
			}
		}
		if (subscriptions !== undefined) update();
	}, [subscriptions]);

	useEffect(() => {
		if (initIsSubscribed !== undefined) {
			setIsSubscribed(initIsSubscribed);
		}
	}, [initIsSubscribed]);

	useEffect(() => {
		if (!channelId) throw new Error("Error: channelId undefined");
		async function initialize() {
			try {
				getUserInfo(user.uid).then((arr) => {
					setInitIsSubscribed(channelId in arr[INDEX_USER_INFO_SUBS]);
				});
			} catch (error) {
				throw new Error(error);
			}
		}
		initialize();
	}, []);

	return (
		<Button style={style} variant="contained" onClick={handleButtonClick}>
			<Typography variant="body2" fontWeight={"medium"}>
				{isSubscribed === undefined ? "Loading..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
			</Typography>
		</Button>
	);
}

export default function VideoInfo({}) {
	const { videoInfo } = useContext(VideoContext);
	const [componentWidth, setComponentWidth] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const updateComponentWidth = () => {
			const width = document.getElementById("component").offsetWidth;
			setComponentWidth(width);
		};

		window.addEventListener("resize", updateComponentWidth);
		updateComponentWidth();
		setLoading(false);
		return () => {
			window.removeEventListener("resize", updateComponentWidth);
		};
	}, []);

	return (
		<Box style={styles.topBox}>
			{loading ? (
				<LoadingEyeCatcher />
			) : (
				<Stack direction={"column"} sx={{ marginBottom: "10px" }}>
					<TextEllipsis id="component" text={videoInfo.title} variant={"h6"} componentWidth={componentWidth} fontSize={"18px"} />

					<Stack direction="row" style={styles.channelNLike}>
						<Link reloadDocument to={"/user/" + videoInfo.userId}>
							<img style={styles.userPhoto} src={videoInfo.userPhoto} alt="Channel photo" />
						</Link>
						<Stack direction="column" style={styles.nameSubCount}>
							<Link reloadDocument to={"/user/" + videoInfo.userId}>
								<TextEllipsis variant={"subtitle1"} fontWeight={"medium"} allowedRows={1} text={videoInfo.channelName} componentWidth={componentWidth} />
							</Link>

							<div style={styles.subCountDiv}>
								<Typography variant="caption" noWrap={true} style={styles.subCount}>
									{roundNumber(videoInfo.subscriber_count, "subcribers")}
								</Typography>
							</div>
						</Stack>
						<SubscribeButton channelId={videoInfo.userId} />
						<div style={styles.likes}>
							<LikeButtons likes={videoInfo.likes} />
						</div>
					</Stack>
					<VideoDescription videoInfo={videoInfo} />
				</Stack>
			)}
		</Box>
	);
}

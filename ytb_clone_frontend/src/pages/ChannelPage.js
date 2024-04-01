import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { getUserInfo, roundNumber } from "../helpfulFunctions";
import { stackStyle } from "./SearchPage";
import { EyeSetup, EyeText, defaultStyles } from "../components/EyeCatcherDefaults";
import InfiniteScrollUserPage from "../components/VideoPageComps/InfiniteScroll/InfiniteScrollUserPage";
import Typography from "@mui/material/Typography";
import { SubscribeButton } from "../components/VideoPageComps/VideoInfo";
import { plainTextButtonStyles } from "../components/VideoPageComps/VideoInfo";

let customButtonStyles = JSON.parse(JSON.stringify(plainTextButtonStyles));
customButtonStyles.marginLeft = "0px";
customButtonStyles.width = "100px";
customButtonStyles.height = "50px";

let customStyles = JSON.parse(JSON.stringify(defaultStyles));
customStyles.title.fontSize = 40;
customStyles.title.fontWeight = "bold";
customStyles.videoText = { textAlign: "center" };

const style = {
	topDiv: {
		marginTop: "20px",
	},
	channelPhoto: {
		borderRadius: "50%",
		height: "200px",
		width: "200px",
	},
};

export default function ChannelPage() {
	const { userId } = useParams();
	const [userInfo, setUserInfo] = useState();
	const [loading, setLoading] = useState(true);
	const [componentWidth, setComponentWidth] = useState(0);

	async function initialize() {
		let newUserInfo = {};
		[newUserInfo.title, newUserInfo.userPhoto, newUserInfo.subscriber_count, newUserInfo.subscribed_to] = await getUserInfo(userId);
		setUserInfo(newUserInfo);
		setLoading(false);
	}

	useEffect(() => {
		initialize();
		return EyeSetup(setComponentWidth);
	}, []);

	return (
		<div id="component" style={style.topDiv}>
			{loading ? (
				<Loading />
			) : (
				<div
					style={{
						...stackStyle,
						gap: "20px",
					}}
				>
					<img style={style.channelPhoto} src={userInfo.userPhoto} alt="Channel photo" />
					<EyeText objInfo={userInfo} componentWidth={componentWidth} styles={customStyles} />
					<Typography fontSize={20}>{roundNumber(userInfo.subscriber_count, userInfo.subscriber_count == 1 ? "Subscriber" : "Subscribers")}</Typography>
					<SubscribeButton style={customButtonStyles} channelId={userId} />
					<InfiniteScrollUserPage />
				</div>
			)}
		</div>
	);
}

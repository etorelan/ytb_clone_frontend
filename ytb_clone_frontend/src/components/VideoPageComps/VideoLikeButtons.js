import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

import { API_ROUTE, AuthContext } from "../../utils/AuthContext";

const styles = {
	likeButton: {
		borderTopLeftRadius: "30px",
		borderBottomLeftRadius: "30px",
		width: "103px",
		height: "36px",
		backgroundColor: "#272727",
	},
	dislikeButton: {
		width: "52px",
		height: "36px",
		backgroundColor: "#272727",
		borderTopRightRadius: "30px",
		borderBottomRightRadius: "30px",
	},
};

export default function LikeButtons({ likes }) {
	const { videoId } = useParams();
	const { user } = useContext(AuthContext);
	const [liked, setLiked] = useState(false);
	const [disliked, setDisliked] = useState(false);

	const handleLike = async () => {
		user.getIdToken().then(function (token) {
			fetch(API_ROUTE + "like", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
				body: JSON.stringify({ userId: user.uid, videoId: videoId, hasLiked: true }),
			});
		});
		setDisliked(false);
		setLiked(!liked);
	};

	const handleDislike = async () => {
		user.getIdToken().then(function (token) {
			fetch(API_ROUTE + "like", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
				body: JSON.stringify({ userId: user.uid, videoId: videoId, hasLiked: false }),
			});
		});
		setLiked(false);
		setDisliked(!disliked);
	};

	useEffect(() => {
		async function init() {
			let res = await fetch(API_ROUTE + "like-info", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId: user.uid, videoId: videoId }),
			});
			let data = await res.json();
			if (res.status == 200) {
				setLiked(data["liked"]);
				setDisliked(data["disliked"]);
			}
		}
		init();
	}, []);

	return (
		<ButtonGroup
			variant="contained"
			aria-label="outlined primary button group"
			sx={{
				"& .MuiButtonGroup-grouped:not(:last-child)": {
					borderColor: "#656565",
				},
			}}
		>
			<Button
				onClick={handleLike}
				sx={{
					...styles.likeButton,
					"&:hover": {
						backgroundColor: "#3F3F3F",
					},
				}}
				startIcon={liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
			>
				{liked ? Number(likes) + 1 : likes}
			</Button>
			<Button
				onClick={handleDislike}
				sx={{
					...styles.dislikeButton,
					"&:hover": {
						backgroundColor: "#3F3F3F",
					},
				}}
				startIcon={disliked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
			/>
		</ButtonGroup>
	);
}

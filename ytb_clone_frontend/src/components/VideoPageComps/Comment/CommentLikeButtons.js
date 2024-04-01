import React, { useContext, useEffect, useState } from "react";
import {
	roundNumber,
} from "../../../helpfulFunctions";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { IconButton } from "@mui/material";
import { updateDoc, doc, increment } from "firebase/firestore";
import { db } from "../../../firebase_files/Config";
import { API_ROUTE, AuthContext, AuthProvider } from "../../../utils/AuthContext";


const styles = {
	rateButtonsDiv: {
		float: "left",
		display: "flex",
	},
	commentLikes: {
		marginTop: "7px",
		marginRight: "10px",
	},
	buttonsColor: {
		color: "#ffffff",
	}
};

export default function CommentLikeButtons({commentId, commentInfo}) {
	const {user} = useContext(AuthContext)
    const [liked, setLiked] = useState(false);
	const [disliked, setDisliked] = useState(false);

    const handleLike = async () => {
		user.getIdToken().then(function (token) {
			fetch(API_ROUTE + "like-comment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
				body: JSON.stringify({ userId: user.uid, commentId: commentId}),
			});
		});
		setDisliked(false);
		setLiked(!liked);
	};



	return (
		<div style={styles.rateButtonsDiv}>
			<IconButton
				onClick={handleLike}
				sx={{
					...styles.buttonsColor,
					"&:hover": {
						backgroundColor: "#3F3F3F",
					},
				}}>
				{liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
			</IconButton>
			<div className="comment-text" style={styles.commentLikes}>
				{roundNumber(commentInfo.likes + (liked ? 1 : 0), "")}
			</div>
			<IconButton
				onClick={() => {
					setDisliked(!disliked);
					setLiked(false);
				}}
				sx={{
					...styles.buttonsColor,
					"&:hover": {
						backgroundColor: "#3F3F3F",
					},
				}}>
				{disliked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
			</IconButton>
		</div>
	);
}

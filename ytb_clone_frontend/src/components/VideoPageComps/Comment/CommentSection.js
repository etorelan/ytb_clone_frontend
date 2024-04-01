import React from "react";
import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../utils/AuthContext";
import { Button, Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { DISPLAY_COMMENTS_PER_PAGE, createCommentDoc } from "../../../helpfulFunctions";
import { pushCommentId } from "../../../helpfulFunctions";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "./Comment";
import { VideoContext } from "../VideoContext";
import InfiniteScrollComments from "../InfiniteScroll/InfiniteScrollComments";

const styles = {
	input: {
		color: "aliceblue",
		fontSize: "14px",
	},
	inputField: {
		marginLeft: "10px",
		display: "flex",
		flexGrow: 1,
		maxLength: "50",
	},
	topDiv: {
		marginTop: "30px",
	},
	commentButton: {
		float: "right",
		color: "black",
		borderRadius: "30px",
		textTransform: "none",
		marginTop: "10px",
	},
	cancelButton: {
		float: "right",
		color: "aliceBlue",
		borderRadius: "30px",
		textTransform: "none",
		marginRight: "10px",
		marginTop: "10px",
	},
	imageDiv: {
		display: "flex",
		marginTop: "20px",
	},
	photoURL: {
		width: "40px",
		height: "40px",
		borderRadius: "50px",
	},
	infiniteScroll:{
		marginTop:"80px"
	}
};

export default function CommentSection() {
	const {videoInfo} = useContext(VideoContext)
	const { videoId } = useParams();
	const { user } = useContext(AuthContext);
	const [inputValue, setInputValue] = useState("");
	const [commentCount, setCommentCount] = useState(0);

	const navigate = useNavigate();

	const MAX_COMMENT_LENGTH = 300;
	const commentCountString =
		commentCount.toLocaleString("en-US").replace(/,/g, " ") +
		" " +
		"Comments";

	const handleInputChange = (e) => {
		if (e.target.value.length <= MAX_COMMENT_LENGTH) {
			setInputValue(e.target.value);
		}
	};
	const handleComment = async () => {
		if (user) {
			const text = inputValue;
			setInputValue("");
			createCommentDoc(user.uid, text)
				.then((commentId) => {
					pushCommentId(commentId, videoId);
				})
				.catch((error) => {
					throw new Error(error);
				});
		} else {
			navigate("/login");
		}
	};

	useEffect(() => {
		setCommentCount(videoInfo.commentCount);
	}, []);


	return (
		<div style={styles.topDiv}>
			<Typography>{commentCountString}</Typography>
			<div style={styles.imageDiv}>
				{user ? (
					<img src={user.photoURL} style={styles.photoURL} />
				) : (
					<AccountCircle />
				)}
				<TextField
					id="standard-basic"
					placeholder="Add a comment.."
					variant="standard"
					value={inputValue}
					onChange={handleInputChange}
					inputProps={{ style: styles.input }}
					style={styles.inputField}
					sx={{
						"& .MuiInput-underline:before": {
							borderBottomColor: "#F1F1F1",
						},
						"& .MuiInput-underline:after": {
							borderBottomColor: "#F1F1F1",
						},
					}}
				/>
			</div>
			<Button
				onClick={() => handleComment()}
				variant="contained"
				disabled={inputValue.trim() === ""}
				style={styles.commentButton}
				sx={{
					backgroundColor: "#3ea6ff",
					"&.Mui-disabled": {
						backgroundColor: "grey",
					},
				}}>
				{user ? "Comment" : "Login to comment"}
			</Button>
			<Button
				style={styles.cancelButton}
				onClick={() => setInputValue("")}
				sx={{
					"&:hover": {
						backgroundColor: "#3F3F3F",
					},
				}}>
				Cancel
			</Button>
			<div style={styles.infiniteScroll}>
				<InfiniteScrollComments
					items={videoInfo.comments}
					itemsPerPage={DISPLAY_COMMENTS_PER_PAGE}
					Component={Comment}
				/>
			</div>
		</div>
	);
}

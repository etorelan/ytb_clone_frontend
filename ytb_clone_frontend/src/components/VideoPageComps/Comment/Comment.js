import React, { useEffect, useState } from "react";
import { getCommentInfo, stringToUrl } from "../../../helpfulFunctions";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TextEllipsis } from "../../TextEllipsis";
import { Link } from "react-router-dom";
import LoadingEyeCatcher from "../LoadingEyeCatcher";
import CommentLikeButtons from "./CommentLikeButtons";

const styles = {
	topBox: {
		width: "100%",
		display: "flex",
		marginBottom: "10px",
	},
	photoURL: {
		borderRadius: "50px",
		height: "40px",
		width: "40px",
	},
	contentStack: {
		marginLeft: "10px",
	},
	channelName: {
		fontSize: "12.5px",
		fontWeight: "500",
	},
	timeAgo: {
		variant: "caption",
		fontSize: "11.5px",
		color: "#aaaaaa",
		marginLeft: "5px",
	},
	commentTextDiv: {
		marginTop: "5px",
	},
};

export default function Comment({ Id }) {
	const [loading, setLoading] = useState(true);
	const [commentInfo, setCommentInfo] = useState({});
	const [componentWidth, setComponentWidth] = useState(0);
	const [isCollapsed, setIsCollapsed] = useState(true);

	const MAX_ROW_COUNT = 50;
	const COLLAPSED_ROWS = 4;

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	async function initialize() {
		try {
			let newCommentInfo = await getCommentInfo(Id);
			setCommentInfo(newCommentInfo);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		initialize();
		const updateComponentWidth = () => {
			const width = document.getElementById("component").offsetWidth;
			setComponentWidth(width);
		};

		window.addEventListener("resize", updateComponentWidth);
		updateComponentWidth();
		return () => {
			window.removeEventListener("resize", updateComponentWidth);
		};
	}, []);

	return (
		<div>
			{loading ? (
				<LoadingEyeCatcher />
			) : (
				<Box sx={styles.topBox}>
					<img
						style={styles.photoURL}
						src={commentInfo.photoURL}
						alt="Commenter picture"
					/>

					<Stack direction={"column"} style={styles.contentStack}>
						<Stack id="component" direction="row">
							<Link
								reloadDocument={true}
								to={
									"/users/" +
									stringToUrl(commentInfo.channelName)
								}>
								<Typography style={styles.channelName}>
									{commentInfo.channelName}
								</Typography>
							</Link>

							<Typography style={styles.timeAgo}>
								{commentInfo.timeAgo}
							</Typography>
						</Stack>

						<div style={styles.commentTextDiv}>
							<TextEllipsis
								id="component"
								variant="body2"
								text={commentInfo.text}
								allowedRows={
									isCollapsed ? COLLAPSED_ROWS : MAX_ROW_COUNT
								}
								componentWidth={componentWidth}
							/>
								<div
									className="comment-text hover"
									onClick={toggleCollapse}>
									{isCollapsed ? "Show more" : "Show less"}
								</div>
						</div>
						<CommentLikeButtons
							commentId={Id}
							commentInfo={commentInfo}
						/>
					</Stack>
				</Box>
			)}
		</div>
	);
}

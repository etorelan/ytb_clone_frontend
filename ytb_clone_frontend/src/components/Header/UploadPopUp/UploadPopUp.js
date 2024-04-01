import React from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { API_ROUTE, AuthContext } from "../../../utils/AuthContext";
import { createVideoDoc, pushVideoId } from "../../../helpfulFunctions";
import {
	FileName,
	ThumbnailUploadButton,
	UploadErrorText,
	UploadStateText,
	UploadWaitBar,
	VideoUploadButton,
} from "./UploadPopUpComps";

const MAX_VIDEO_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 2000;

const styles = {
	closeButton: {
		position: "absolute",
		right: 10,
		top: 10,
	},
};

const CustomDialog = styled(Dialog)({
	"& .MuiDialog-paper": {
		backgroundColor: "#0f0f0f",
	},
});

export default function UploadPopUp({ isOpen, handleClose }) {
	const { user } = React.useContext(AuthContext);
	const [videoError, setVideoError] = useState(null);
	const [videoName, setVideoName] = useState(null);
	const [waiting, setWaiting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [thumbnailName, setThumbnailName] = useState(null);

	const MAX_VIDEO_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB in bytes

	const handleVideoUpload = async (event) => {
		event.preventDefault();
		setSuccess(false);

		const video = event.target.video.files[0];
		const thumbnail = event.target.thumbnail.files[0];
		const videoTitle = event.target.videoTitle.value;
		const videoDescription = event.target.videoDescription.value;

		if (!video || !videoTitle || !videoDescription) {
			setVideoError("Invalid form");
			return;
		}

		// if (video.size > MAX_VIDEO_SIZE_BYTES) {
		// 	setVideoError("Video size too large, maximum 20MB");
		// 	return;
		// } else {
		// 	setVideoError(null);
		// }

		const formData = new FormData();
		formData.append("video", video);
		formData.append("thumbnail", thumbnail);
		formData.append("videoTitle", videoTitle);
		formData.append("videoDescription", videoDescription);

		try {
			setWaiting(true);
			const response = await fetch(API_ROUTE + "video-upload/", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (response.ok) {
				try {
					await createVideoDoc(
						user.uid,
						data.videoId,
						data.thumbnail,
						videoTitle
					);
					await pushVideoId(user.uid, data.videoId);
					setSuccess(true);
				} catch (error) {
					console.error("Failed to create video document");
				}
			} else {
				console.error(data.message);
				setVideoError(data.message);
				setSuccess(false);
			}
		} catch (error) {
			console.error("Error occurred while uploading video:", error);
			setVideoError(error);
		}
		setWaiting(false);
	};

	return (
		<div>
			<CustomDialog
				open={isOpen || waiting}
				onClose={() => {
					handleClose();
					setVideoError(null);
					setVideoName(null);
					setThumbnailName(null);
					setSuccess(false);
				}}
				maxWidth={"md"}
				fullWidth={true}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle
					id="alert-dialog-title"
					sx={{ fontWeight: "bold", color: "aliceblue" }}>
					Upload a video
					<IconButton
						style={styles.closeButton}
						onClick={() => {
							handleClose();
							setVideoError(null);
							setVideoName(null);
							setThumbnailName(null);
							setSuccess(false);
						}}>
						<CloseIcon sx={{ color: "aliceblue" }} />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
						// overflowY: "clip",
					}}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "space-between",
						}}>
						<VideoUploadButton />
						<ThumbnailUploadButton />
					</div>

					<FileName fileName={videoName} type={"video"} />
					<FileName fileName={thumbnailName} type={"thumbnail"} />

					<form
						onSubmit={handleVideoUpload}
						style={{ marginTop: "10px" }}>
						<input
							type="text"
							name="videoTitle"
							maxLength={MAX_VIDEO_TITLE_LENGTH.toString()}
							placeholder="Video title"
							className="custom-input"
							style={{ width: "400px" }}
						/>
						<textarea
							id="multilineInput"
							className="upload-text-area"
							name="videoDescription"
							maxLength={MAX_DESCRIPTION_LENGTH.toString()}
							rows="10"
							cols="50"
							placeholder="Video description"
						/>
						<input
							type="file"
							name="video"
							style={{ display: "none" }}
							className="custom-input"
							accept="video/*"
							id="video-input"
							onChange={(event) => {
								setVideoName(
									event.target.files.length > 0
										? event.target.files[0].name
										: null
								);
							}}
						/>
						<input
							type="file"
							name="thumbnail"
							style={{ display: "none" }}
							className="custom-input"
							accept="image/*"
							id="thumbnail-input"
							onChange={(event) => {
								setThumbnailName(
									event.target.files.length > 0
										? event.target.files[0].name
										: null
								);
							}}
						/>
						<Button
							type="submit"
							variant="contained"
							color="error"
							sx={{ marginTop: "10px" }}>
							Upload
						</Button>
					</form>

					<UploadWaitBar waiting={waiting} />
					<UploadStateText success={success} />
					<UploadErrorText videoError={videoError} />
				</DialogContent>
			</CustomDialog>
		</div>
	);
}

export function AlertDialog() {}

import React from "react";
import DialogContentText from "@mui/material/DialogContentText";
import { Box, InputLabel, LinearProgress } from "@mui/material";
import { IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CropOriginalOutlinedIcon from "@mui/icons-material/CropOriginalOutlined";

export function VideoUploadButton() {
	return (
		<InputLabel htmlFor="video-input" sx={{ marginRight: "20px" }}>
			<IconButton
				variant="contained"
				component="span"
				size="large"
				sx={{
					width: "300px",
					height: "300px",
					borderRadius: "50%",
					backgroundColor: "#f0f0f0",
				}}>
				<UploadFileIcon sx={{ fontSize: "200px", color: "#d32f2f" }} />
			</IconButton>
		</InputLabel>
	);
}

export function ThumbnailUploadButton() {
	return (
		<InputLabel htmlFor="thumbnail-input">
			<IconButton
				variant="contained"
				component="span"
				size="large"
				sx={{
					width: "150px",
					height: "150px",
					borderRadius: "50%",
					backgroundColor: "#f0f0f0",
				}}>
				<CropOriginalOutlinedIcon
					sx={{ fontSize: "100px", color: "#d32f2f" }}
				/>
			</IconButton>
		</InputLabel>
	);
}

export function UploadStateText({ success }) {
	return (
		<DialogContentText
			id="alert-dialog-description"
			sx={{
				color: "aliceblue",
				marginTop: "20px",
				marginBottom: "20px",
			}}>
			{success ? "Upload successful! 🎉" : "Choose a file to upload"}
		</DialogContentText>
	);
}

export function UploadErrorText({ videoError }) {
	return (
		videoError != null && (
			<DialogContentText sx={{ color: "#d32f2f", fontWeight: "bold", marginTop:"-15px" }}>
				{videoError}
			</DialogContentText>
		)
	);
}
export function UploadWaitBar({waiting}){
	return (
		waiting && (
			<Box
				sx={{
					width: "100%",
					color: "#d32f2f",
					marginTop: "10px",
				}}>
				<LinearProgress color="inherit" />
			</Box>
		)
	)
}
export function FileName({fileName, type}){
	return (
		fileName != null && (
			<DialogContentText
				sx={{ color: "aliceblue", marginTop: "10px" }}>
				{`Uploaded ${type}: ` + fileName}
			</DialogContentText>
		)
	)
}

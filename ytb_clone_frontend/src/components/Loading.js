import React from "react";
import { CircularProgress } from "@mui/material";

const Loading = () => {
	return (
		<div style={{ textAlign: "center", paddingTop: "15%" }}>
			<h3>Loading...</h3> <CircularProgress />
		</div>
	);
};
export default Loading;


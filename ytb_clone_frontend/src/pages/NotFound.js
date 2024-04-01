import React from "react";
import { Typography } from "@mui/material";

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100vh",
	},
};

export default function NotFound() {
	return (
		<div
			style={styles.container}>
			<Typography variant="h2">Oops!</Typography>
			<Typography variant="h3">This page doesn't exist.</Typography>
		</div>
	);
}

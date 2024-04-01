import React from "react";

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100vh",
		backgroundColor: "#f8f9fa",
		color: "#212529",
	},
	heading: {
		fontSize: "2rem",
		marginBottom: "1rem",
	},
};


export default function ErrorPage() {
	return (
		<div style={styles.container}>
			<h1 style={styles.heading}>Oops! Something went wrong.</h1>
		</div>
	);
}


import React from "react";
import { auth } from "../firebase_files/Config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase_files/Config";

const SignupPage = () => {
	const [errorCode, setErrorCode] = React.useState();
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();
		let username = e.target.username.value;
		let email = e.target.email.value;
		let password = e.target.password.value;

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				updateProfile(user, {
					displayName: username,
				})
					.then(() => {
						setDoc(doc(db, "users", user.uid), {
							subscriber_count: 0,
							name: user.displayName,
							photoURL:user.photoURL,
							video_ids: [],
							subscribed_to: {},
						})
							.catch((error) => {
								setErrorCode(error.code);
								console.log(error.code);
							});
					})
					.catch((error) => {
						setErrorCode(error.code);
						console.log(error.code);
					});

				navigate("/");
			})
			.catch((error) => {
				setErrorCode(error.code);
				console.log(error.code);
			});
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
			}}>
			<form onSubmit={handleSignUp}>
				<Typography variant="h1"> Sign Up </Typography>
				<input
					type="text"
					name="username"
					placeholder="Username"
					className="custom-input"
					style={{ marginTop: "40px" }}
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					className="custom-input"
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					className="custom-input"
				/>
				<Button
					type="submit"
					variant="contained"
					className="login-button"
					sx={{ marginTop: "20px" }}>
					Sign up
				</Button>
			</form>
			<h6 style={{ display: "flex", justifyContent: "center" }}>
				{errorCode
					? "ERROR: " +
					  errorCode
							.slice(errorCode.indexOf("/") + 1)
							.replaceAll("-", " ")
							.toUpperCase()
					: ""}
			</h6>
		</div>
	);
};

export default SignupPage;

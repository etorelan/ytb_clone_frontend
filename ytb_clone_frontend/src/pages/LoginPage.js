import React from "react";
import { auth, provider } from "../firebase_files/Config";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const LoginPage = () => {
	const [errorCode, setErrorCode] = React.useState();
	let navigate = useNavigate();

	const handleGoogleLogin = (e) => {
		e.preventDefault();
		signInWithPopup(auth, provider)
			.then((res) => {
				if (res) {
					if (window.location.search) {
						let urlParams = new URLSearchParams(
							window.location.search
						);
						urlParams.forEach((val, key) => {
							if (key === "to") {
								navigate(val);
								return;
							}
						});
					} else {
						navigate("/");
					}
				}
			})
			.catch((error) => {
				setErrorCode(error.code);
				console.log(error);
			});
	};

	const handleLogin = (e) => {
		e.preventDefault();
		let email = e.target.email.value;
		let password = e.target.password.value;

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				navigate("/");
			})
			.catch((error) => {
				setErrorCode(error.code);
				console.log(error);
			});
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}>
			<Typography variant="h1"> Login </Typography>
			<form onSubmit={handleLogin}>
				<input type="email" name="email" className="custom-input" placeholder="Email" />
				<input type="password" name="password" className="custom-input"placeholder="Password" />
				<Button
					type="submit"
					variant="contained"
					className="login-button"
					sx={{width:"310px"}}
					>

					Login
				</Button>
			</form>

			<Button
				variant="contained"
				onClick={() => navigate("/signup")}
				className="login-button"
				color="success"
				sx={{width:"310px"}}>
				Sign up
			</Button>
			<div>
				<Button
					variant="outlined"
					size="large"
					className="login-button"
					sx={{ marginTop: "10px" }}
					startIcon={<GoogleIcon />}
					onClick={handleGoogleLogin}>
					Login
				</Button>
			</div>
			<h6>
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
export default LoginPage;

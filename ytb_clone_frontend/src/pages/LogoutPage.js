import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase_files/Config";

export default function LogoutPage() {
	const navigate = useNavigate();

	useEffect(() => {
		auth.signOut();
		navigate("/");
	}, [navigate]);

	return null;
}

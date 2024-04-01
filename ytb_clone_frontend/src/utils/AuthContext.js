import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase_files/Config";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "../components/Loading";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
			}}>
			{loading ? <Loading /> : children}
		</AuthContext.Provider>
	);
};

export const API_ROUTE = "https://ytb-clone-backend.onrender.com/api/";

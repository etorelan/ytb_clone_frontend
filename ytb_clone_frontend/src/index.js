import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./utils/AuthContext";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import LogoutPage from "./pages/LogoutPage";
import UploadPopUp from "./components/Header/UploadPopUp/UploadPopUp";
import VideoPage from "./pages/VideoPage";
import { VideoProvider } from "./components/VideoPageComps/VideoContext";
import MainSideDrawer from "./components/Header/MainSideDrawer";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import ChannelPage from "./pages/ChannelPage";


const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{ path:"" , element: <HomePage/>},
			{ path: "login", element: <LoginPage /> },
			{ path: "signup", element: <SignupPage /> },
			{ path: "logout", element: <LogoutPage /> },
			{ path: "upload", element: <UploadPopUp /> },
			{
				path: "videos/:videoId",
				element: (
					<VideoProvider>
						<VideoPage/>
					</VideoProvider>
				),
			},
			{ path: "search/:searchWord", element: <SearchPage/>},
			{ path: "user/:userId" , element: <ChannelPage/>},
			{ path: "subscriptions/", element: <SubscriptionsPage/>}

		],
	},
	{ path: "*", element: <NotFound /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

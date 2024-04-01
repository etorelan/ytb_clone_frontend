import React, { createContext, useState } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
	const [videoInfo, setVideoInfo] = useState({});
    const [hasScrolledOrZoomedOut, setHasScrolledOrZoomedOut] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)
	const [sidebarVideos, setSidebarVideos] = useState([])
	
	return (
		<VideoContext.Provider
			value={{
				videoInfo,
                hasScrolledOrZoomedOut,
                windowWidth,   
				sidebarVideos, 
				setVideoInfo,
                setHasScrolledOrZoomedOut,
                setWindowWidth,
				setSidebarVideos
			}}>
			{children}
		</VideoContext.Provider>
	);
};

import React, { useEffect, useState } from "react";
import { API_ROUTE } from "../../utils/AuthContext";
import { useParams } from "react-router-dom";

function VideoDescription({ videoInfo }) {
	const { videoId } = useParams();
	const [description, setDescription] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);

	const getDescription = async () => {
		let response = await fetch(API_ROUTE + "description/" + videoId, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		let data = await response.json();
		if (response.status === 200) {
			setDescription(data["videoDescription"]);
		} else {
			throw new Error("Description could not be loaded");
		}
	};

	const toggleDescription = () => {
		setIsExpanded(!isExpanded);
	};

	useEffect(() => {
		getDescription();
	}, []);


	return (
		<div onClick={toggleDescription} className={`video-description ${isExpanded ? "expanded" : ""}`}>
			{isExpanded ? (
				<div className="description-content top">
					{`${
						videoInfo.rawViews.toLocaleString("en-US").replace(/,/g, " ")
					} views ${videoInfo.uploadDate.toString()}`}
				</div>
			) : (
				<div className="description-content top">
					{`${videoInfo.views}  ${videoInfo.timeAgo}`}
				</div>
			)}

			<div className="description-content">{description}</div>
			<button className="description-button">
				{isExpanded ? "Show Less" : "Show More"}
			</button>
		</div>
	);
}

export default VideoDescription;

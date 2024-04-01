import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DISPLAY_COMMENTS_PER_PAGE } from "../../../helpfulFunctions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase_files/Config";
import debounce from "lodash.debounce";
import { LOAD_COMMENTS_PER_PAGE } from "../../../helpfulFunctions";

export default function InfiniteScrollComments({ items, itemsPerPage, Component }) {
	const { videoId } = useParams();
	// displayedItems referring to the elements currently beind displayed
	const [displayedItems, setDisplayedItems] = useState([]);
	const [stateItems, setStateItems] = useState(items);
	const [page, setPage] = useState(1);

	const loadMoreComments = async (videoId, lastIndex) => {
		if (videoId) {
			const videoSnap = await getDoc(doc(db, "videos", videoId.toString()));
			if (videoSnap.exists()) {
				try {
					const videoData = videoSnap.data();
					let newObj = videoData.comments.slice(lastIndex, lastIndex + LOAD_COMMENTS_PER_PAGE);
					return newObj;
				} catch (error) {
					console.error("Error 500: Error getting video info");
				}
			} else {
				console.error("Error 404: User Id not found");
			}
		}
	};

	const displayMoreComments = async () => {
		const startIndex = (page - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		let placeholder = stateItems;
		let nextItems = [];
		if ((page * DISPLAY_COMMENTS_PER_PAGE) % LOAD_COMMENTS_PER_PAGE == 0) {
			nextItems = await loadMoreComments(videoId, endIndex);
			placeholder = stateItems.concat(nextItems);
			setStateItems(placeholder);
		}
		const newDisplayedItems = [...displayedItems, ...placeholder.slice(startIndex, endIndex)];
		setDisplayedItems(newDisplayedItems);
		if (placeholder.slice(startIndex, endIndex).length > 0) {
			setPage(page + 1);
		}
	};

	useEffect(() => {
		const debouncedDisplayMoreComments = debounce(displayMoreComments, 200);

		const handleScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			if (scrollY + windowHeight >= documentHeight - 200) {
				debouncedDisplayMoreComments();
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			debouncedDisplayMoreComments.cancel();
		};
	}, [displayedItems, stateItems, itemsPerPage, page]);

	return (
		<div>
			{displayedItems.map((item, index) => (
				<div key={index}>{React.createElement(Component, { Id: item })}</div>
			))}
		</div>
	);
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DISPLAY_VIDEOS_PER_PAGE } from "../../../helpfulFunctions";
import { db } from "../../../firebase_files/Config";
import debounce from "lodash.debounce";
import { getDoc, doc } from "firebase/firestore";
import Loading from "../../Loading";
import { VideoGrid } from "./InfiniteScrollSidebar";

const styles = {
	topDiv : {
		width : "90%"
	}
}

export default function InfiniteScrollUserPage() {
	const [displayedItems, setDisplayedItems] = useState([]);
	const [fetchedItems, setFetchedItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const { userId } = useParams();
	const [userSnap, setUserSnap] = useState();

	function updateDisplayedItems(
		startIndex,
		endIndex,
		fetched = fetchedItems
	) {
		const newDisplayedItems = [
			...displayedItems,
			...fetched.slice(startIndex, endIndex),
		];
		setDisplayedItems(newDisplayedItems);
		if (fetched.slice(startIndex, endIndex).length > 0) {
			setPage(page + 1);
		}
	}
	const displayMoreVideos = () => {
		const startIndex = page * DISPLAY_VIDEOS_PER_PAGE;
		const endIndex = startIndex + DISPLAY_VIDEOS_PER_PAGE;
		updateDisplayedItems(startIndex, endIndex);
	};

	useEffect(() => {
		const debouncedDisplayMoreVideos = debounce(displayMoreVideos, 300);

		const handleScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			if (scrollY + windowHeight >= documentHeight - 200) {
				debouncedDisplayMoreVideos();
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			debouncedDisplayMoreVideos.cancel();
		};
	}, [displayedItems, fetchedItems]);

	const initialize = async () => {
		const user = await getDoc(doc(db, "users", userId.toString()));
		setUserSnap(user);
	};

	useEffect(() => {
		initialize();
	}, []);

	useEffect(() => {
		if (userSnap !== undefined) {
			const userData = userSnap.data();
			const newFetched = userData.video_ids.reverse();
			setFetchedItems(newFetched);
			const startIndex = page * DISPLAY_VIDEOS_PER_PAGE;
			const endIndex = startIndex + DISPLAY_VIDEOS_PER_PAGE;
			updateDisplayedItems(startIndex, endIndex, newFetched);
			setLoading(false);
		}
	}, [userSnap]);

	return (
		<div style={styles.topDiv}>
			{loading ? (
				<Loading />
			) : (
				<VideoGrid displayedItems={displayedItems} />
			)}
		</div>
	);
}

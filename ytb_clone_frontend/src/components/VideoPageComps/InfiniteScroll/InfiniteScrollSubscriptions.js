import React, { useState, useEffect, useContext } from "react";
import debounce from "lodash.debounce";
import { DISPLAY_VIDEOS_PER_PAGE } from "../../../helpfulFunctions";
import { VideoGrid } from "./InfiniteScrollSidebar";
import Loading from "../../Loading";
import { API_ROUTE, AuthContext } from "../../../utils/AuthContext";

const styles = {
	topDiv: {
		width: "97%",
	},
};

export default function InfiniteScrollSubscriptions({ subscriptions }) {
	const { user } = useContext(AuthContext);
	const [displayedItems, setDisplayedItems] = useState([]);
	const [fetchedItems, setFetchedItems] = useState([]);
	const [subs, setSubs] = useState(subscriptions.map((item) => [item, 0]));
	const [loading, setLoading] = useState(true);
	const [weeksAgo, setWeeksAgo] = useState(8);
	const [page, setPage] = useState(0);

	function updateDisplayedItems(startIndex, endIndex, fetched = fetchedItems) {
		const newDisplayedItems = [...displayedItems, ...fetched.slice(startIndex, endIndex)];
		setDisplayedItems(newDisplayedItems);
		if (fetched.slice(startIndex, endIndex).length > 0) {
			setPage(page + 1);
		}
	}
	const displayMoreVideos = async () => {
		const startIndex = page * DISPLAY_VIDEOS_PER_PAGE;
		const endIndex = startIndex + DISPLAY_VIDEOS_PER_PAGE;
		if (endIndex > fetchedItems.length) {
			initialize(0, 1).then((res) => {
				updateDisplayedItems(startIndex, endIndex, [...fetchedItems, ...res]);
			});
		} else {
			updateDisplayedItems(startIndex, endIndex);
		}
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

	const initialize = async (pageUp, weeksAgoUp) => {
		let token = await user.getIdToken();
		let res = await fetch(API_ROUTE + "subscriptions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			body: JSON.stringify({ subscriptions: subs, weeksAgo: weeksAgo }),
		});

		let data = await res.json();
		if (res.status == 200) {
			setWeeksAgo(weeksAgo + weeksAgoUp);
			setSubs(data["subscriptions"]);
		}

		return data["items"];
	};

	useEffect(() => {
		initialize(0, 1).then((res) => {
			const newFetched = [...fetchedItems, ...res];
			setFetchedItems(newFetched);
			updateDisplayedItems(0, DISPLAY_VIDEOS_PER_PAGE, newFetched);
			setLoading(false);
		});
	}, []);

	return <div style={styles.topDiv}>{loading ? <Loading /> : <VideoGrid displayedItems={displayedItems} />}</div>;
}

import React, { useState, useEffect } from "react";
import {
	DISPLAY_VIDEOS_PER_PAGE,
	LOAD_VIDEOS_PER_PAGE,
} from "../../../helpfulFunctions";
import debounce from "lodash.debounce";
import Loading from "../../Loading";
import EyeCatcher from "../../EyeCatcher";
import { getSuggestions } from "../../Header/SearchBar";
import { useParams } from "react-router-dom";
import EyeCatcherWrapped from "../../SearchPageComps/EyeCatcher-Wrapped";
import { defaultStyles } from "../../EyeCatcherDefaults";

const customStyles = JSON.parse(JSON.stringify(defaultStyles));
customStyles.thumbnail.height = "auto";
customStyles.thumbnail.width = "50vw";
customStyles.thumbnail.maxWidth = "300px";
customStyles.title.fontSize = 19;

export default function InfiniteScrollSearchPage() {
	const [displayedItems, setDisplayedItems] = useState([]);
	const [fetchedItems, setFetchedItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const { searchWord } = useParams();

	const debouncedDisplayMoreVideos = debounce(displayMoreVideos, 500);

	function updateDisplayedItems(startIndex, endIndex) {
		const newDisplayedItems = [
			...displayedItems,
			...fetchedItems.slice(startIndex, endIndex),
		];
		setDisplayedItems(newDisplayedItems);
		if (fetchedItems.slice(startIndex, endIndex).length > 0) {
			setPage(page + 1);
		}
	}

	async function displayMoreVideos() {
		const startIndex = page * DISPLAY_VIDEOS_PER_PAGE;
		const endIndex = startIndex + DISPLAY_VIDEOS_PER_PAGE;
		if (startIndex % LOAD_VIDEOS_PER_PAGE == 0) {
			await getSuggestions(searchWord, setFetchedItems, page, 1);
		} else {
			updateDisplayedItems(startIndex, endIndex);
		}
	}

	useEffect(() => {
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

	useEffect(() => {
		displayMoreVideos();
	}, []);

	useEffect(() => {
		const startIndex = page * DISPLAY_VIDEOS_PER_PAGE;
		const endIndex = startIndex + DISPLAY_VIDEOS_PER_PAGE;
		updateDisplayedItems(startIndex, endIndex);
		setLoading(false);
	}, [fetchedItems]);

	return (
		<div>
			{loading ? (
				<Loading />
			) : (
				displayedItems.map((item, index) => (
					<div key={index}>
						{React.createElement(EyeCatcherWrapped, {
							videoId: item,
							customStyles: customStyles,
						})}
					</div>
				))
			)}
		</div>
	);
}

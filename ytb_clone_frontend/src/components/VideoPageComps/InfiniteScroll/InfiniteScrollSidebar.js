import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DISPLAY_VIDEOS_PER_PAGE, LOAD_VIDEOS_PER_PAGE } from "../../../helpfulFunctions";
import { db } from "../../../firebase_files/Config";
import debounce from "lodash.debounce";
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import Loading from "../../Loading";
import EyeCatcher from "../../EyeCatcher";
import { defaultStyles } from "../../EyeCatcherDefaults";
import Grid from "@mui/material/Grid";
import EyeCatcherWrapped from "../../SearchPageComps/EyeCatcher-Wrapped";
import Button from "@mui/material/Button";
import { breakPointTheme } from "../../../pages/VideoPage";

const style = {
	loadMoreButton:{
		width:"100%"
	}
}

export function VideoGrid({ displayedItems }) {
	const xsSize = 12 / 1;
	const smSize = 12 / 2;
	const mdSize = 12 / 3;
	const lgSize = 12 / 4;

	const customStyles = JSON.parse(JSON.stringify(defaultStyles));
	customStyles.thumbnail.height = "auto";
	customStyles.thumbnail.width = "50vw";
	customStyles.thumbnail.minWidth = "100%";
	customStyles.thumbnail.maxWidth = "100%";
	customStyles.title.fontSize = 19;
	customStyles.topBox.flexDirection = "column";

	return (
		<Grid container spacing={2}>
			{displayedItems.map((item, index) => (
				<Grid key={index} item xs={xsSize} sm={smSize} md={mdSize} lg={lgSize}>
					{React.createElement(EyeCatcherWrapped, {
						videoId: item,
						customStyles: customStyles,
					})}
				</Grid>
			))}
		</Grid>
	);
}

export default function InfiniteScrollSidebar({ isGrid = false, displayWidth = "100%", windowWidth }) {
	const [displayedItems, setDisplayedItems] = useState([]);
	const [fetchedItems, setFetchedItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [lastDoc, setLastDoc] = useState();
	const { videoId } = useParams("videoId");
	const [page, setPage] = useState(1);

	const loadMoreVideos = async (loadedMore = false) => {
		if ((windowWidth < breakPointTheme.breakpoints.values.lg && loadedMore) || windowWidth >= breakPointTheme.breakpoints.values.lg) {
			const next = query(collection(db, "videos"), orderBy("views", "desc"), startAfter(lastDoc), limit(LOAD_VIDEOS_PER_PAGE));

			const newSidebarVideoDocs = await getDocs(next);
			setLastDoc(newSidebarVideoDocs[newSidebarVideoDocs.length - 1]);

			let newStateItems = [];

			newSidebarVideoDocs.forEach((doc) => {
				newStateItems.push(doc.id);
			});
			return newStateItems;
		} else {
			return [];
		}
	};

	const displayMoreVideos = async (loadedMore = false) => {
		const startIndex = page * DISPLAY_VIDEOS_PER_PAGE;
		const endIndex = startIndex + DISPLAY_VIDEOS_PER_PAGE;
		let placeholder = fetchedItems;
		let nextItems = [];
		if (startIndex % LOAD_VIDEOS_PER_PAGE == 0 && lastDoc != undefined) {
			nextItems = await loadMoreVideos(loadedMore);
			placeholder = fetchedItems.concat(nextItems);
			setFetchedItems(placeholder);
		}
		const newDisplayedItems = [...displayedItems, ...placeholder.slice(startIndex, endIndex)];
		setDisplayedItems(newDisplayedItems);
		setDisplayedItems(newDisplayedItems);
		if (placeholder.slice(startIndex, endIndex).length > 0) {
			setPage(page + 1);
		}
	};

	useEffect(() => {
		const debouncedDisplayMoreVideos = debounce(displayMoreVideos, 200);

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
		try {
			const bootQuery = query(collection(db, "videos"), orderBy("views", "desc"), limit(LOAD_VIDEOS_PER_PAGE));
			const docSnapshots = await getDocs(bootQuery);
			let newVideoArray = [];
			setLastDoc(docSnapshots.docs[docSnapshots.docs.length - 1]);
			docSnapshots.forEach((doc) => {
				newVideoArray.push(doc.id);
			});
			setDisplayedItems(newVideoArray.slice(0, DISPLAY_VIDEOS_PER_PAGE));
			setFetchedItems(newVideoArray);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		initialize();
	}, []);

	return (
		<div style={{ width: displayWidth }}>
			{loading ? (
				<Loading />
			) : isGrid ? (
				<VideoGrid displayedItems={displayedItems} />
			) : (
				<div>
					{displayedItems.map((item, index) => (
						<div key={index}>{videoId === item ? <div /> : React.createElement(EyeCatcher, { videoId: item })}</div>
					))}
					{windowWidth < breakPointTheme.breakpoints.values.lg ? (
						<Button
							variant="outlined"
							sx={style.loadMoreButton}
							onClick={() => {
								displayMoreVideos(true);
							}}
						>
							LOAD MORE VIDEOS
						</Button>
					) : (
						<div />
					)}
				</div>
			)}
		</div>
	);
}

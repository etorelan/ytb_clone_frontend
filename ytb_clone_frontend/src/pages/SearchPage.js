import React from "react";
import InfiniteScrollSearchPage from "../components/VideoPageComps/InfiniteScroll/InfiniteScrollSearchPage";

export const stackStyle = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
}

export default function SearchPage() {
	return (
		<div
			style={stackStyle}>
			<div>
				<InfiniteScrollSearchPage/>
			</div>
		</div>
	);
}

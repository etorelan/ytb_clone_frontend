import React from "react";
import { stackStyle } from "./SearchPage";
import InfiniteScrollSidebar from "../components/VideoPageComps/InfiniteScroll/InfiniteScrollSidebar";


export default function HomePage() {
	return (
		<div style={{width:"97%", marginTop:"30px", ...stackStyle}}>
			<InfiniteScrollSidebar isGrid={true}/>
		</div>
	);
}

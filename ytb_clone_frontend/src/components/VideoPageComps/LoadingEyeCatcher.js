import React from "react";
export default function LoadingEyeCatcher() {
	return (
		<div id="component" className="skeleton-recommendation">
			<div className="skeleton-thumbnail"></div>
			<div className="skeleton-info">
				<div className="skeleton-title"></div>
				<div className="skeleton-description"></div>
			</div>
		</div>
	);
}

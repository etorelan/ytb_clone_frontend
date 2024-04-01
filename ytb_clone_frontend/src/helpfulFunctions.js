import {
	doc,
	setDoc,
	Timestamp,
	updateDoc,
	arrayUnion,
	collection,
	getDoc,
	addDoc,
} from "firebase/firestore";
import { db } from "./firebase_files/Config";
import debounce from "lodash.debounce";

export const RANDOM_POWER = 32;
export const LOAD_COMMENTS_PER_PAGE = 20;
export const LOAD_VIDEOS_PER_PAGE = 28;
export const DISPLAY_COMMENTS_PER_PAGE = 5;
export const DISPLAY_VIDEOS_PER_PAGE = 14;

export function roundNumber(number, unit) {
	if (number >= 1000000000) {
		return (number / 1000000000).toFixed(1) + `B ${unit}`;
	} else if (number >= 1000000) {
		return (number / 1000000).toFixed(1) + `M ${unit}`;
	} else if (number >= 1000) {
		return (number / 1000).toFixed(0) + `K ${unit}`;
	} else {
		return number + ` ${unit}`;
	}
}

export function formatTimeAgo(timestamp) {
	const currentTime = new Date();
	const timeDifference = currentTime - timestamp.toDate();
	let formattedTime;

	// in milliseconds
	const intervals = {
		minute: 60 * 1000,
		hour: 60 * 60 * 1000,
		day: 24 * 60 * 60 * 1000,
		week: 7 * 24 * 60 * 60 * 1000,
		month: 30 * 24 * 60 * 60 * 1000,
		year: 356 * 24 * 60 * 60 * 1000,
	};

	if (timeDifference < intervals.minute) {
		formattedTime = `${Math.floor(timeDifference / 1000)} seconds ago`;
	} else if (timeDifference < intervals.hour) {
		const minutes = Math.floor(timeDifference / intervals.minute);
		formattedTime = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	} else if (timeDifference < intervals.day) {
		const hours = Math.floor(timeDifference / intervals.hour);
		formattedTime = `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else if (timeDifference < intervals.week) {
		const days = Math.floor(timeDifference / intervals.day);
		formattedTime = `${days} day${days > 1 ? "s" : ""} ago`;
	} else if (timeDifference < intervals.month) {
		const weeks = Math.floor(timeDifference / intervals.week);
		formattedTime = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
	} else if (timeDifference < intervals.year) {
		const months = Math.floor(timeDifference / intervals.month);
		formattedTime = `${months} month${months > 1 ? "s" : ""} ago`;
	} else {
		const years = Math.floor(timeDifference / intervals.year);
		formattedTime = `${years} year${years > 1 ? "s" : ""} ago`;
	}
	return formattedTime;
}

export async function createVideoDoc(userId, videoId, thumbnail, videoTitle) {
	setDoc(doc(db, "videos", videoId.toString()), {
		title: videoTitle,
		userId: userId,
		comments: [],
		views: 0,
		timestamp: Timestamp.now(),
		thumbnail: thumbnail,
		random: Math.random(2 ** RANDOM_POWER),
		likes: 0,
		likedBy: {},
		dislikes:0,
		dislikedBy: {},
	}).catch((error) => {
		console.error(error);
		throw new Error("Failed to create the video document");
	});
}

export async function pushVideoId(userId, videoId) {
	updateDoc(doc(db, "users", userId.toString()), {
		video_ids: arrayUnion(videoId),
	}).catch((error) => {
		console.error(error);
		throw new Error("Failed to create the video document");
	});
}

export async function createCommentDoc(userId, text) {
	try {
		const docRef = await addDoc(collection(db, "comments"), {
			uid: userId,
			timestamp: Timestamp.now(),
			text: text,
			likes: 0,
			likedBy:{},
			replies: [],
		});
		const newDocId = docRef.id;
		return newDocId;
	} catch (error) {
		console.error("Error creating document:", error);
		throw new Error(error);
	}
}

export async function pushCommentId(commentId, videoId) {
	updateDoc(doc(db, "videos", videoId.toString()), {
		comments: arrayUnion(commentId.toString()),
	}).catch((error) => {
		console.error("Error creating document:", error);
		throw new Error(error);
	});
}


// "INDEX_USER_INFO_SUBS" to access the userData.subscribed_to property of the "getDoc" function
export const INDEX_USER_INFO_SUBS = 4;
export async function getUserInfo(userId) {
	const userSnap = await getDoc(doc(db, "users", userId.toString()));

	if (userSnap.exists()) {
		const userData = userSnap.data();
		return [userData.name, userData.photoURL, userData.subscriber_count, userData.video_ids, userData.subscribed_to];
	} else {
		console.error("Error 404: User Id not found");
		throw new Error("Error 404: User Id not found");
	}
}

export const loadMoreComments = debounce(async (videoId, lastIndex) => {
	const videoSnap = await getDoc(doc(db, "videos", videoId.toString()));
	if (videoSnap.exists()) {
		try {
			const videoData = videoSnap.data();
			return videoData.comments.slice(
				lastIndex + 1,
				lastIndex + 1 + LOAD_COMMENTS_PER_PAGE
			);
		} catch (error) {
			console.error("Error 500: Error getting video info");
			return [];
		}
	} else {
		console.error("Error 404: User Id not found");
		return [];
	}
}, 500);

export async function getVideoInfo(videoId) {
	const videoSnap = await getDoc(doc(db, "videos", videoId.toString()));

	if (videoSnap.exists()) {
		try {
			const videoData = videoSnap.data();
			let videoInfo = {};
			[
				videoInfo.channelName,
				videoInfo.userPhoto,
				videoInfo.subscriber_count,
			] = await getUserInfo(videoData.userId);
			videoInfo.userId = videoData.userId
			videoInfo.title = videoData.title;
			videoInfo.thumbnail = videoData.thumbnail;
			videoInfo.views = roundNumber(videoData.views, videoData.views == 1 ? "view": "views");
			videoInfo.rawViews = videoData.views;
			videoInfo.comments = videoData.comments.slice(
				0,
				LOAD_COMMENTS_PER_PAGE
				);
			videoInfo.commentCount = videoData.comments.length;
			videoInfo.likes = roundNumber(videoData.likes, "");
			videoInfo.timeAgo = formatTimeAgo(videoData.timestamp);
			videoInfo.uploadDate = videoData.timestamp
			.toDate()
			.toDateString()
			.slice(4);
			console.log(videoInfo);

			return videoInfo;
		} catch (error) {
			console.error("Error 500: Error getting video info");
			throw new Error(error);
		}
	} else {
		console.error(`Error 404: Video Id ${videoId} not found`);
		throw new Error("Error 404: Video ID not found");
	}
}
export async function initializeEyeCatcher(videoId, setVideoInfo, setLoading) {
	let newVideoInfo = await getVideoInfo(videoId).catch((error) => {
		console.error(error);
	});
	setVideoInfo(newVideoInfo);
	setLoading(false);
}

export async function getComment(commentId) {
	const commentRef = await getDoc(doc(db, "comments", commentId));
	if (commentRef.exists()) {
		const data = commentRef.data();
		return data;
	} else {
		console.error("Error 404: Comment not found");
	}
}

export async function getCommentInfo(commentId) {
	let newCommentInfo = {};
	try {
		const commentInfo = await getComment(commentId);
		const [username, photoURL, _] = await getUserInfo(commentInfo.uid);

		newCommentInfo.channelName = username;
		newCommentInfo.photoURL = photoURL;
		newCommentInfo.timeAgo = formatTimeAgo(commentInfo.timestamp);
		newCommentInfo.text = commentInfo.text;
		newCommentInfo.likes = commentInfo.likes;
	} catch (error) {
		console.error(error);
	}
	return newCommentInfo;
}

export function stringToUrl(inputString) {
	return inputString.toLowerCase().replace(/\s+/g, "-").trim();
}

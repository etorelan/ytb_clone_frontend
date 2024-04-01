import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import { INDEX_USER_INFO_SUBS } from "../helpfulFunctions";
import { getUserInfo } from "../helpfulFunctions";
import NoSubscriptions from "../components/SubscriptionPageComps/NoSubscriptions";
import InfiniteScrollSubscriptions from "../components/VideoPageComps/InfiniteScroll/InfiniteScrollSubscriptions";

export default function SubscriptionsPage() {
	const { user } = useContext(AuthContext);
	const [subscriptions, setSubscriptions] = useState(); // {channelName / userId : num of videos already loaded from the end}

	const navigate = useNavigate();

	useEffect(() => {
		async function initialize() {
			if (!user) navigate("/login");
			else {
				try {
					const newSubsArray = await getUserInfo(user.uid);
					setSubscriptions(Object.keys(newSubsArray[INDEX_USER_INFO_SUBS]))
				} catch (error) {
					throw new Error(error);
				}
			}
		}
		initialize();
	}, []);

	return <div>{subscriptions === undefined ? <NoSubscriptions /> : <InfiniteScrollSubscriptions subscriptions={subscriptions} />} </div>;
}

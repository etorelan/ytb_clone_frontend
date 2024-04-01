import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import YoutubeShortsIcon from "../../../src/youtube-shorts-logo-15250.svg";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import HistoryIcon from "@mui/icons-material/History";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";

const drawerWidth = 240;
const icons = [
	[
		"Home",

		<Badge variant="dot" color="success">
			<HomeIcon sx={{ color: "aliceblue" }} />
		</Badge>,
	],
	[
		"Shorts",
		<img
			src={YoutubeShortsIcon}
			style={{ width: "24px", height: "24px" }}
			alt="My Icon"
		/>,
	],
	[
		"Subscriptions",
		<Badge variant="dot" color="success">
			<SubscriptionsIcon sx={{ color: "aliceblue" }} />
		</Badge>,
	],
	["Library", <VideoLibraryIcon sx={{ color: "aliceblue" }} />],
	["History", <HistoryIcon sx={{ color: "aliceblue" }} />],
];

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "isOpen",
})(({ theme, isOpen }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(isOpen && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "isOpen",
})(({ theme, isOpen }) => ({
	width: drawerWidth,
	flexShrink: 0,
	marginTop: "200px",
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(isOpen && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!isOpen && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

export default function MainSideDrawer({ isOpen }) {
	return (
		<Drawer
			variant="permanent"
			isOpen={isOpen}
			PaperProps={{
				sx: {
					backgroundColor: "#0f0f0f",
				},
			}}>
			<List sx={{ marginTop: "64px" }}>
				{icons.map((arr) => (
					<Link
						key={arr[0]}
						to={
							arr[0] == "Home" ? "/" : arr[0].toLowerCase() + "/"
						}>
						<ListItem
							key={arr[0]}
							disablePadding
							sx={{ display: "block", marginTop: "20px" }}>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: isOpen
										? "initial"
										: "center",
									px: 2.5,
								}}>
								<Tooltip title={arr[0]} placement="right-end">
									<ListItemIcon
										sx={{
											minWidth: 0,
											mr: isOpen ? 3 : "auto",
											justifyContent: "center",
										}}>
										{arr[1]}
									</ListItemIcon>
								</Tooltip>
								<ListItemText
									primary={arr[0]}
									sx={{
										opacity: isOpen ? 1 : 0,
										color: "aliceblue",
									}}
								/>
							</ListItemButton>
						</ListItem>
					</Link>
				))}
			</List>
			<Divider />
		</Drawer>
	);
}

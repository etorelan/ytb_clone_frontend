import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

import FileUploadIcon from "@mui/icons-material/FileUpload";

import { AuthContext } from "../../utils/AuthContext";
import { auth } from "../../firebase_files/Config";
import UploadPopUp from "./UploadPopUp/UploadPopUp";
import SearchBar from "./SearchBar";
import MainSideDrawer from "./MainSideDrawer";

const theme = createTheme({
	palette: {
		neutral: {
			main: "#0f0f0f",
			contrastText: "#fff",
		},
	},
});

export const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "auto",
	},
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}));

export default function Header() {
	const { user } = React.useContext(AuthContext);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
	const [uploadPopUpVisible, setUploadPopUpVisible] = React.useState(false);
	const [sideDrawerOpen, setSideDrawerOpen] = React.useState(false);
	const settings = auth.currentUser ? ["Logout"] : ["Login", "Sign Up"];

	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleOpenUploadPopUp = () => {
		setUploadPopUpVisible(true);
	};

	const handleCloseUploadPopUp = () => {
		setUploadPopUpVisible(false);
	};

	const handleDrawer = () => {
		setSideDrawerOpen(!sideDrawerOpen);
	};

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const menuId = "primary-search-account-menu";
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			id={menuId}
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			{settings.map((option) => (
				<MenuItem key={option} component={Link} className="custom-link" onClick={handleMenuClose} to={"/" + option.toLowerCase().replace(/\s+/g, "")}>
					{option}
				</MenuItem>
			))}
		</Menu>
	);

	const mobileMenuId = "primary-search-account-menu-mobile";
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			{user && (
				<MenuItem onClick={handleOpenUploadPopUp}>
					<IconButton size="large" aria-label="upload a video" color="inherit">
						<FileUploadIcon />
					</IconButton>
					<p>Upload a video</p>
				</MenuItem>
			)}
			<MenuItem>
				<IconButton size="large" aria-label="show 17 new notifications" color="inherit">
					<Badge badgeContent={"WIP"} color="error">
						<NotificationsIcon />
					</Badge>
				</IconButton>
				<p>Notifications</p>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
					{user ? <img src={user.photoURL} style={{ width: "32px", height: "32px", borderRadius: "50px" }} /> : <AccountCircle />}
				</IconButton>
				<p>Profile</p>
			</MenuItem>
		</Menu>
	);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<UploadPopUp isOpen={uploadPopUpVisible} handleClose={handleCloseUploadPopUp} />
			<ThemeProvider theme={theme}>
				<AppBar position="fixed" color="neutral" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
					<Toolbar>
						<IconButton size="large" edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawer} sx={{ mr: 2 }}>
							<MenuIcon />
						</IconButton>
						<YouTubeIcon sx={{ color: "#ff0000", fontSize: "30px", marginRight: "5px", marginTop: "2px", display: { xs: "none", sm: "block" } }} />

						<Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
							<Link to="/"> YouTube </Link>
						</Typography>

						<div style={{ marginLeft: "auto", marginRight: "auto", marginBottom: "10px", display: "flex", flexGrow: 0.5 }}>
							<SearchBar />
						</div>

						<Box sx={{ flexGrow: 0.1 }} />
						<Box sx={{ display: { xs: "none", md: "flex" } }}>
							{user && (
								<IconButton size="large" aria-label="upload a video" color="inherit" onClick={handleOpenUploadPopUp}>
									<FileUploadIcon />
								</IconButton>
							)}
							<IconButton size="large" aria-label="show 17 new notifications" color="inherit">
								<Badge badgeContent={"WIP"} color="error">
									<NotificationsIcon />
								</Badge>
							</IconButton>
							<IconButton size="large" edge="end" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
								{user ? <img src={user.photoURL} style={{ width: "32px", height: "32px", borderRadius: "50px" }} /> : <AccountCircle />}
							</IconButton>
						</Box>
						<Box sx={{ display: { xs: "flex", md: "none" } }}>
							<IconButton size="large" aria-label="show more" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
								<MoreIcon />
							</IconButton>
						</Box>
					</Toolbar>
				</AppBar>
			</ThemeProvider>
			{renderMobileMenu}
			{renderMenu}

			<MainSideDrawer isOpen={sideDrawerOpen} />
		</Box>
	);
}

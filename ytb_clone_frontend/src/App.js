import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import "./App.css";

const MAIN_SIDE_DRAWER_DENT_FIX_TOP = "-120px"
const MAIN_SIDE_DRAWER_DENT_FIX_LEFT = "70px"

function App() {
	return (
		<div>
			<Header />
			<div style={{marginTop:MAIN_SIDE_DRAWER_DENT_FIX_TOP,  paddingLeft:MAIN_SIDE_DRAWER_DENT_FIX_LEFT}}>
				<Outlet />
			</div>
		</div>
	);
}

export default App;

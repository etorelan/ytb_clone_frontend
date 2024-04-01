import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import { API_ROUTE } from "../../utils/AuthContext";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const styles = {
	topDiv: {
		marginBottom: "20px",
		height: "20px",
		marginTop: "10px",
		flexGrow: 1,
	},
	searchButton: { borderTopRightRadius: "30px", backgroundColor: "#272727", borderBottomRightRadius: "30px" },
	buttonsColor : {color: "aliceblue"}
};

export const getSuggestions = debounce(async (query, setter, page = 0, searchPage = 0) => {
	if (!query) return setter([]);

	let searchBarQuery = new URLSearchParams();
	searchBarQuery.append("query", query);
	searchBarQuery.append("page", page);
	searchBarQuery.append("searchPage", searchPage);

	let res = await fetch(API_ROUTE + "search-bar?" + searchBarQuery, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	let data = await res.json();
	if (res.status === 200) {
		setter(data);
	}
}, 200);

export default function SearchBar() {
	const [suggestions, setSuggestions] = React.useState([]);
	const { searchWord } = useParams();
	const [input, setInput] = React.useState(searchWord);

	const navigate = useNavigate();

	const handleUserChoice = (event, value, reason, detail) => {
		if (reason == "selectOption" || reason == "createOption") {
			navigate(`/search/${value}`);
			window.location.reload();
		}
	};

	const handleButtonSearch = () => {
		navigate(`/search/${input}`);
		window.location.reload();
	};

	return (
		<div style={styles.topDiv}>
			<Autocomplete
				id="tags-outlined"
				autoComplete={true}
				clearOnEscape
				clearIcon={<ClearIcon sx={styles.buttonsColor} />}
				freeSolo
				noOptionsText=""
				defaultValue={searchWord ? searchWord : ""}
				options={suggestions}
				sx={{
					"&:hover": { backgroundColor: "transparent" },
					"& .MuiAutocomplete-popper": {
						backgroundColor: "red",
					},
				}}
				onChange={(event, value, reason, detail) => handleUserChoice(event, value, reason, detail)}
				renderInput={(params) => (
					<div style={{ display: "flex", flexDirection: "row" }}>
						<TextField
							{...params}
							size="small"
							sx={{
								input: { color: "aliceblue" },
								"&  .MuiOutlinedInput-notchedOutline": {
									borderColor: "#2b2b2b",
									borderRadius: "50px",
									borderTopRightRadius: "0px",
									borderBottomRightRadius: "0px",
								},
								"& .MuiAutocomplete-inputRoot:hover  .MuiOutlinedInput-notchedOutline": {
									borderColor: "#2b2b2b",
								},
								"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
									borderColor: "#1976D2",
								},
							}}
							onChange={(event) => {
								getSuggestions(event.target.value, setSuggestions);
								setInput(event.target.value);
							}}
						/>
						<Button
							disableRipple
							sx={{
								...styles.searchButton,
								"&:hover": {
									backgroundColor: "#272727",
								},
							}}
							onClick={handleButtonSearch}
							endIcon={<SearchIcon sx={styles.buttonsColor} />}
						/>
					</div>
				)}
			/>
		</div>
	);
}

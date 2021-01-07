import React, { useState, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { Searchbar, Checkbox } from "react-native-paper";
import AllThumbnails from "../components/AllThumbnails";
import userConfig from "../config/userConfig";
import { Html5Entities } from "html-entities";
import ScreenContainer from "../components/UI/ScreenContainer";
import { ThemeContext } from "../context/context";

const entities = new Html5Entities();

export default function SearchScreen(props) {
	const [value, setValue] = useState("");
	const [searchTimer, setSearchTimer] = useState(null);
	const [results, setResults] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [theme] = useContext(ThemeContext);
	const [notYet, setNotYet] = useState(false);
	const [checked, setChecked] = useState(false);

	const { navigation, route } = props;

	async function fetchData(text) {
		const link = userConfig.pluginInstalled
			? `${userConfig.siteURL}/?rest_route=/search/v1/search&keyword=${text}&per_page=${userConfig.searchPerPage}`
			: `${userConfig.siteURL}/?rest_route=/wp/v2/${userConfig.searchPostType}&_embed&search=${text}&per_page=${userConfig.searchPerPage}`;

		const res = await fetch(link);
		res
			.json()
			.then((res) => {
				setResults(res);
				setIsFetching(false);
				if (results.length > 0) {
					setNotYet(false);
				}
			})
			.catch((err) => console.log("Searching fetch error:"+err));
	}
	return (
		<ScreenContainer notYet={false}>
			<Searchbar
				style={styles.searchBar}
				inputStyle={{
					textAlign: userConfig.textDirection == "rtl" ? "right" : "left",
				}}
				onChangeText={(text) => {
					if (searchTimer) {
						clearTimeout(searchTimer);
					}
					let encoded = text.replace(new RegExp(" ", "g"), "+");
					setValue(text);
					if (text.length > 0) {
						setIsFetching(true);
						setSearchTimer(
							setTimeout(() => {
								if (!theme.offline || checked) {
									fetchData(entities.encode(encoded));
								} else {
									const offlineResults = theme[
										userConfig.searchPostType
									].filter(
										(post) =>
											post.content.rendered
												.toLowerCase()
												.indexOf(encoded.toLowerCase()) > -1 ||
											post.title.rendered
												.toLowerCase()
												.indexOf(encoded.toLowerCase()) > -1 ||
											post.excerpt.rendered
												.toLowerCase()
												.indexOf(encoded.toLowerCase()) > -1,
									);
									setIsFetching(false);
									setResults(offlineResults);
								}
							}, 2000),
						);
					}
				}}
				value={value}
			/>
			{theme.offline && (
				<View
					style={{
						...styles.offlineContainer,
						backgroundColor: theme.colors.backgroundAlt,
					}}>
					<View>
						<Checkbox
							status={checked ? "checked" : "unchecked"}
							onPress={() => {
								setChecked(!checked);
								setResults([]);
							}}
							color={theme.colors.text}
							uncheckedColor={theme.colors.background}
						/>
					</View>
					<View style={styles.offlineText}>
						<Text
							style={{ color: theme.colors.text, fontSize: 16 }}
							onPress={() => {
								setChecked(!checked);
								setResults([]);
							}}>
							{userConfig.appTexts.onlineSearch}
						</Text>
					</View>
				</View>
			)}
			{isFetching && (
				<View style={styles.altContainer}>
					<ActivityIndicator size="large" color={theme.colors.text} />
				</View>
			)}
			{results.length === 0 && value.length > 0 && !isFetching && (
				<View style={styles.altContainer}>
					<Text style={{ color: theme.colors.text }}>
						{userConfig.appTexts.noResults}
					</Text>
				</View>
			)}
			<AllThumbnails data={results} navigation={navigation} fetchData={null} />
		</ScreenContainer>
	);
}
export const screenOptions = ({ navigation, route }) => {
	return {
		headerTitle: userConfig.appTexts.searchScreenName,
	};
};
const styles = StyleSheet.create({
	altContainer: {
		width: "100%",
		flex: 1,
		alignItems: "center",
		alignContent: "center",
		justifyContent: "center",
		flexDirection: "column",
		marginTop: Dimensions.get("window").height * 0.35,
	},
	searchBar: {
		height: 40,
		borderColor: "gray",
		backgroundColor: "#fff",
		borderWidth: 1,
		width: "90%",
		marginHorizontal: "4.5%",
		marginTop: Dimensions.get("window").height * 0.01,
		flexDirection: userConfig.textDirection === "rtl" ? "row-reverse" : "row",
	},
	offlineContainer: {
		marginTop: Dimensions.get("window").height * 0.01,
		flexDirection: userConfig.textDirection === "rtl" ? "row-reverse" : "row",
		padding: 5,
		borderRadius: 5,
		width: "90%",
		flexWrap: "wrap",
	},
	offlineText: {
		alignSelf: "center",
	},
});

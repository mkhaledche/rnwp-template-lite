import React, { useState, useEffect, useReducer, useContext } from "react";
import { ActivityIndicator, Text } from "react-native";
import AllThumbnails from "../components/AllThumbnails";
import reducer from "../functions/reducer";
import { ThemeContext, InternetContext } from "../context/context";
import ScreenContainer from "../components/UI/ScreenContainer";
import userConfig from "../config/userConfig";

export default function AllCatScreen(props) {
	const { navigation, route } = props;
	const [categories, setCategories] = useState([]);
	const [state, dispatch] = useReducer(reducer, { catPage: 1 });
	const [theme] = useContext(ThemeContext);
	const { taxonomy } = route.params;
	const internet = useContext(InternetContext);
	let excludes = "&exclude=";
	userConfig.excludedCatIDs.map((exclude) => {
		excludes = excludes + "," + exclude;
	});

	async function fetchData(opts) {
		const link =
			categories.length == 0
				? `${userConfig.siteURL}/?rest_route=/wp/v2/${taxonomy.endPoint}&per_page=${userConfig.onlineCatsPerPage}&page=${state.catPage}${excludes}`
				: `${userConfig.siteURL}/?rest_route=/wp/v2/${
						taxonomy.endPoint
				  }&per_page=${userConfig.onlineCatsPerPage}&page=${
						state.catPage + 1
				  }${excludes}`;

		const res = await fetch(link, opts);
		res
			.json()
			.then((res) => {
				setCategories([...categories, ...res]);
			})
			.catch((err) => console.log("Categories fetch error:"+err));
	}

	useEffect(() => {
		const abortCtrl = new AbortController();
		const opts = { signal: abortCtrl.signal };
		if (theme.offline === true) {
			setTimeout(() => {
				setCategories(theme[taxonomy.endPoint].slice(0, 4));
			}, 1000);
		}
		if (theme.offline === false) {
			fetchData(opts);
		}
		return function cleanup() {
			abortCtrl.abort();
		};
	}, []);

	if (categories.length == 0) {
		if (!theme.offline && !internet) {
			return (
				<ScreenContainer notYet={true}>
					<Text style={{ color: theme.colors.text }}>
						{userConfig.appTexts.noInternet}
					</Text>
				</ScreenContainer>
			);
		} else {
			return (
				<ScreenContainer notYet={true}>
					<ActivityIndicator size="large" color={theme.colors.text} />
				</ScreenContainer>
			);
		}
	} else {
		return (
			<ScreenContainer notYet={false}>
				<AllThumbnails
					data={categories}
					navigation={navigation}
					catThumb={true}
					action={[state, dispatch]}
					fetchData={fetchData}
					setOffline={setCategories}
					type={taxonomy}
					page={state.catPage}
					offlinePosts={null}
					saved={false}
				/>
				{/* <CatGrid data={categories} /> */}
			</ScreenContainer>
		);
	}
}

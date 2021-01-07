import React, { useState, useEffect, useReducer, useContext } from "react";
import { StyleSheet, ActivityIndicator, Text } from "react-native";
import AllThumbnails from "../components/AllThumbnails";
import reducer from "../functions/reducer";
import ScreenContainer from "../components/UI/ScreenContainer";
import { ThemeContext, InternetContext } from "../context/context";
import userConfig from "../config/userConfig";
import { useIsFocused } from "@react-navigation/native";

export default function AllPostScreen(props) {
	const { navigation, route } = props;
	const [posts, setPosts] = useState([]);
	const [state, dispatch] = useReducer(reducer, { postPage: 1 });
	const [theme] = useContext(ThemeContext);
	const internet = useContext(InternetContext);

	const { postType, taxonomy } = route.params;
	let excludes = "&exclude=";
	userConfig.excludedPostIDs.map((exclude) => {
		excludes = excludes + "," + exclude;
	});
	const catQuery =
		typeof route.params?.category === "undefined"
			? ""
			: `&${taxonomy}=${route.params.category}`;

	const isFocused = useIsFocused();

	//Add excluded Posts
	const relevantPosts =
		typeof route.params?.category === "undefined"
			? theme[postType.endPoint].filter(
					(post) => !userConfig.excludedPostIDs.includes(post.id),
			  )
			: theme[postType.endPoint].filter(
					(post) =>
						post[taxonomy] !== 0 &&
						post[taxonomy].includes(route.params.category) &&
						!userConfig.excludedPostIDs.includes(post.id),
			  );

	async function fetchData(opts) {
		try {
			const link =
				posts.length == 0
					? `${userConfig.siteURL}/?rest_route=/wp/v2/${postType.endPoint}&_embed${catQuery}&per_page=${userConfig.onlinePostsPerPage}&page=${state.postPage}${excludes}`
					: `${userConfig.siteURL}/?rest_route=/wp/v2/${
							postType.endPoint
					  }&_embed${catQuery}&per_page=${
							userConfig.onlinePostsPerPage
					  }&page=${state.postPage + 1}${excludes}`;

			const res = await fetch(link, opts);
			const newPosts = await res.json();

			setPosts([...posts, ...newPosts]);
		} catch (e) {
			console.log("Posts fetch error:" + e);
		}
	}
	useEffect(() => {
		const abortCtrl = new AbortController();
		const opts = { signal: abortCtrl.signal };

		fetchData(opts);

		return function cleanup() {
			abortCtrl.abort();
		};
	}, []);

	if (posts.length == 0) {
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
					data={posts}
					navigation={navigation}
					action={[state, dispatch]}
					fetchData={fetchData}
					setOffline={setPosts}
					type={postType}
					page={state.postPage}
					offlinePosts={relevantPosts}
				/>
			</ScreenContainer>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		width: "100%",
		flex: 1,
		backgroundColor: "#ece",
		alignItems: "flex-start",
		alignContent: "center",
		justifyContent: "center",
	},
});
export const screenOptions = ({ navigation, route }) => {
	return {
		headerTitle:
			typeof route.params?.catName === "undefined"
				? route.params.postType.name
				: route.params.catName,
	};
};

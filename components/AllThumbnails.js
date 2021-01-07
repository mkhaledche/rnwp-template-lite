import React, { useState, useEffect, useContext } from "react";
import { View, ActivityIndicator, FlatList } from "react-native";
import Post from "./Post";
import Categories from "./Categories";
import { ThemeContext } from "../context/context";

//Component for posts and categories thumbnails to be used in AllPostScreen and AllCatScreen
const AllThumbnails = (props) => {
	//Getting required data from the related screen and from the app context
	const {
		data,
		navigation,
		catThumb,
		fetchData,
		setOffline,
		type,
		page,
		offlinePosts,
		saved,
	} = props;
	const dispatch = props.action ? props.action[1] : null;
	const [isFetching, setIsFetching] = useState(false);
	const [theme] = useContext(ThemeContext);

	return (
		<View>
			<FlatList
				data={data}
				keyExtractor={(item) => "" + item.id}
				renderItem={({ item }) => {
					//Check if user is in categories or in posts page
					if (catThumb) {
						return <Categories data={item} navigation={navigation} />;
					} else {
						//Thumbnail prop shall be needed to check if this is a post thumbnail or the total post
						return (
							<Post data={item} navigation={navigation} thumbnail={true} />
						);
					}
				}}
				onEndReachedThreshold={0.9}
				onEndReached={({ distanceFromEnd }) => {
					//Fetching new data when user scrolls to end (infinite scroll) either from the internet or from stored data depending on whether is using online or offline mode
					const nextAction = catThumb ? "nextCat" : "nextPost";
					if (distanceFromEnd != 0 && fetchData != null && !saved) {
						setIsFetching(true);
						dispatch({ type: nextAction });
						if (theme.offline === false) {
							setTimeout(async () => {
								await fetchData();
								setIsFetching(false);
							}, 500);
						}
						if (theme.offline === true) {
							const relatedPosts = catThumb
								? theme[type.endPoint]
								: offlinePosts;
							setOffline([
								...data,
								...relatedPosts.slice(4 * page, 4 * (page + 1)),
							]);
							setIsFetching(false);
						}
					}
				}}
			/>
			{/* Bottom loader icon if the app is fetching new data on end scroll */}
			{isFetching && fetchData != null && (
				<View
					style={{ backgroundColor: theme.colors.background, marginBottom: 0 }}>
					<ActivityIndicator size="large" color={theme.colors.text} />
				</View>
			)}
		</View>
	);
};

export default React.memo(AllThumbnails);

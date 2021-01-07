import React, { useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../context/context";
import userConfig from "../config/userConfig";
import { adjustText } from "../functions/miscFunctions";
import PostText from "../components/UI/PostText";

//Component using the data for each category thumbnail
const Post = (props) => {
	const { data, thumbnail } = props;
	const Container = thumbnail ? TouchableOpacity : View;
	const navigation = useNavigation();
	const [theme] = useContext(ThemeContext);

	return (
		<Container
			style={{
				...styles.postContainer,
				backgroundColor: theme.colors.containerColor,
			}}
			onPress={() => {
				// If the screen is AllPostScreen not SinglePostScreen then it shall navigate to the related post when touched
				if (thumbnail) {
					navigation.navigate("Single", { data, colors: theme.colors });
				}
			}}>
			<View style={styles.titleContainer}>
				<PostText title={true}>{adjustText(data.title.rendered)}</PostText>
			</View>
			<View style={styles.excerptContainer}>
				<PostText title={false}>
					{thumbnail
						? userConfig.supportsExcerpt //Check if the app is supporting post excerpt
							? adjustText(
									data.excerpt.rendered
										.replace(/<\/?[^>]+(>|$)/g, "") //removing all HTML tags
										.replace(/\[.*?\]/g, ""), //removing all WordPress shortcodes
							  )
							: adjustText(
									data.content.rendered
										.replace(/<\/?[^>]+(>|$)/g, "")
										.replace(/\[.*?\]/g, ""),
							  ).substr(0, userConfig.excerptMaxChar) + "..."
						: data.content.rendered
								.replace(/<\/?[^>]+(>|$)/g, "")
								.replace(/\[.*?\]/g, "")}
				</PostText>
			</View>
			{thumbnail && //Check if the app is supporting featured image and this post is having a featured image
				userConfig.supportsFeaturedImage &&
				data.featured_media != 0 && (
					<Image
						style={{ width: "100%", height: 150 }}
						source={{
							uri: data._embedded["wp:featuredmedia"]["0"].source_url,
						}}
					/>
				)}
		</Container>
	);
};

export default Post;
const styles = StyleSheet.create({
	postContainer: {
		width: "90%",
		marginHorizontal: "4.5%",
		marginVertical: 10,
		paddingHorizontal: "4%",
		paddingVertical: 15,
		borderRadius: 10,
	},
	titleContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	excerptContainer: {},
	titleText: {
		fontSize: 20,
		// fontFamily: "roboto-bold",
	},
	excerptText: {
		fontSize: 20,
		// fontFamily: "roboto-regular",
	},
});

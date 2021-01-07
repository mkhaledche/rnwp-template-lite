import React, { useContext, useState } from "react";
import {
	StyleSheet,
	ScrollView,
	Share,
	View,
	Platform,
	Dimensions,
	Image,
} from "react-native";
import { Button } from "react-native-paper";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { setSetting, adjustText } from "../functions/miscFunctions";
import ScreenContainer from "../components/UI/ScreenContainer";
import PostText from "../components/UI/PostText";
import { ThemeContext } from "../context/context";
import { Html5Entities } from "html-entities";
import HTML from "react-native-render-html";
import * as WebBrowser from "expo-web-browser";
import { WebView } from "react-native-webview";
import userConfig from "../config/userConfig";

function youtube_parser(url) {
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	var match = url.match(regExp);
	return match && match[7].length == 11 ? match[7] : false;
}
const entities = new Html5Entities();

export default function SinglePostScreen({ navigation, route }) {
	const post = route.params.data;
	const [theme, dispatch] = useContext(ThemeContext);

	const onShare = async (message) => {
		try {
			const result = await Share.share({
				message,
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			console.log("Share error:" + error.message);
		}
	};

	const contentRemovingTags = adjustText(
		post.content.rendered
			.replace(/<\/?[^>]+(>|$)/g, "")
			.replace(/\[.*?\]/g, ""),
	);

	const excerptRemovingTags =
		post.type == "product"
			? adjustText(
					post.excerpt.rendered
						.replace(/<\/?[^>]+(>|$)/g, "")
						.replace(/\[.*?\]/g, ""),
			  )
			: "";

	const HTMLStyles = {
		p: { color: theme.colors.text, fontSize: 20, lineHeight: 40 },
		a: { fontSize: 20, color: theme.colors.textAlt },
		h1: { color: theme.colors.text, fontSize: 36, lineHeight: 60 },
		h2: { color: theme.colors.text, fontSize: 33, lineHeight: 56 },
		h3: { color: theme.colors.text, fontSize: 30, lineHeight: 52 },
		h4: { color: theme.colors.text, fontSize: 27, lineHeight: 48 },
		h5: { color: theme.colors.text, fontSize: 24, lineHeight: 44 },
		h6: { color: theme.colors.text, fontSize: 22, lineHeight: 40 },
		blockquote: { color: theme.colors.textAlt, marginLeft: 50 },
		li: { color: theme.colors.text, fontSize: 20, lineHeight: 40 },
	};

	return (
		<ScreenContainer notYet={false}>
			<ScrollView style={styles.container}>
				{userConfig.supportsFeaturedImage && post.featured_media != 0 && (
					<Image
						style={{ width: "100%", height: 200, marginTop: 20 }}
						source={{
							uri: post._embedded["wp:featuredmedia"]["0"].source_url,
						}}
					/>
				)}
				{post.type == "product" && (
					<>
						<PostText>{excerptRemovingTags}</PostText>
						<Button
							onPress={async () => {
								await WebBrowser.openBrowserAsync(post.link);
							}}
							color={theme.colors.text}
							mode="contained">
							{userConfig.appTexts.seeProductPage}
						</Button>
					</>
				)}
				<HTML
					renderers={{
						iframe: (htmlAttribs, passProps) => {
							const video_id = youtube_parser(htmlAttribs.src);
							return (
								<View
									key={passProps.key}
									style={{
										width: "100%",
										aspectRatio: 16.0 / 9.0,
										marginTop: 16,
										marginBottom: 16,
									}}>
									<WebView
										scrollEnabled={false}
										source={{ uri: htmlAttribs.src }}
										style={{ flex: 1, width: "100%", aspectRatio: 16.0 / 9.0 }}
									/>
								</View>
							);
						},
						video: (htmlAttribs, children, convertedCSSStyles, passProps) => {
							return (
								<View
									key={passProps.key}
									style={{
										width: "100%",
										aspectRatio: 16.0 / 9.0,
										marginTop: 16,
										marginBottom: 16,
									}}>
									<WebView
										scrollEnabled={false}
										source={{ uri: htmlAttribs.src }}
										style={{ flex: 1, width: "100%", aspectRatio: 16.0 / 9.0 }}
									/>
								</View>
							);
						},
						mediaelementwrapper: () => <View></View>,
					}}
					html={
						post.content?.rendered != ""
							? post.content.rendered.replace(/\[.*?\]/g, "")
							: " "
					}
					imagesMaxWidth={Dimensions.get("window").width}
					staticContentMaxWidth={Dimensions.get("window").width * 0.9}
					onLinkPress={async (href, att) => {
						await WebBrowser.openBrowserAsync(att);
					}}
					tagsStyles={HTMLStyles}
					ignoredStyles={["height", "width"]}
					textSelectable={true}
					alterNode={(node) => {
						const { name, parent } = node;

						if (!name) {
							node.attribs = {
								...(node.attribs || {}),
								style: `color:${theme.colors.text};font-size:20px;line-height:40px;`,
							};
						}
					}}
				/>
				{/* <HTMLView
					value={post.content.rendered}
					stylesheet={styles}
					renderNode={renderNode}
				/> */}
				{/* <Post data={post} navigation={navigation} thumbnail={false} /> */}
				<View
					style={{
						...styles.btnContainer,
						backgroundColor: theme.colors.background,
					}}>
					<Button
						title="Share"
						onPress={() => {
							onShare(
								post.title.rendered +
									"\n" +
									excerptRemovingTags +
									"\n" +
									contentRemovingTags,
							);
						}}>
						<Ionicons
							name={Platform.OS === "android" ? "md-share" : "ios-share"}
							size={30}
							color={theme.colors.text}
						/>
					</Button>
				</View>
			</ScrollView>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: "3%",
		width: "93%",
	},
	btnContainer: {
		marginBottom: Dimensions.get("window").height * 0.13,
		height: 50,
		flexDirection: "row",
		justifyContent: "center",
	},
});
export const screenOptions = ({ navigation, route }) => {
	return {
		headerTitle: entities.decode(route.params.data.title.rendered),
		// headerStyle: {
		// 	backgroundColor: route.params.colors.background,
		// },
	};
};

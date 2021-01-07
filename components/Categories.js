import React, { useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import userConfig from "../config/userConfig";
import { ThemeContext } from "../context/context";
import PostText from "../components/UI/PostText";
import { adjustText } from "../functions/miscFunctions";

//Component using the data for each category thumbnail
const Categories = (props) => {
	const { data } = props;
	const navigation = useNavigation();
	const route = useRoute();
	const [postType] = userConfig.postTypes.filter(
		(type) => type.endPoint == route.params.taxonomy.postType,
	);
	const [theme] = useContext(ThemeContext);

	return (
		<TouchableOpacity
			style={{
				...styles.postContainer,
				backgroundColor: theme.colors.containerColor,
			}}
			onPress={() => {
				//Send to the posts screen showing posts in the related category
				navigation.push("Posts", {
					category: data.id,
					catName: data.name,
					postType,
					taxonomy: route.params.taxonomy.endPoint,
				});
			}}>
			<View style={styles.titleContainer}>
				<PostText title={true}>{adjustText(data.name)}</PostText>
			</View>
			<View style={styles.excerptContainer}>
				<PostText title={true}>{adjustText(data.description)}</PostText>
			</View>
		</TouchableOpacity>
	);
};

export default Categories;
const styles = StyleSheet.create({
	postContainer: {
		width: "90%",
		marginHorizontal: "4.5%",
		// backgroundColor: "#cff",
		marginVertical: 10,
		paddingHorizontal: "2%",
		paddingVertical: 5,
		borderRadius: 10,
	},
	titleContainer: {
		alignItems: "center",
	},
	excerptContainer: {},
	titleText: {
		fontSize: 20,
		color: "#fff",
	},
});

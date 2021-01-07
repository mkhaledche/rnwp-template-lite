import React, { useContext, useState } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { ThemeContext } from "../../context/context";
import { Ionicons } from "@expo/vector-icons";

//Component for social icon with link to the related profile 
const ContactRow = (props) => {
	const iconType = Platform.OS === "ios" ? "ios-" : "md-";
	const [theme] = useContext(ThemeContext);
	const { icon, text } = props;
	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<Ionicons name={icon} size={25} color={theme.colors.text} />
			</View>
			<View style={styles.textContainer}>
				<Text
					style={{
						color: theme.colors.text,
					}}
					selectable={true}>
					{text}
				</Text>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		marginHorizontal: "3%",
		width: "93%",
		flexDirection: userConfig.textDirection === "rtl" ? "row-reverse" : "row",
		marginVertical: 10,
	},
	iconContainer: {
		marginHorizontal: "3%",
		width: "10%",
	},
	textContainer: {
		marginHorizontal: "3%",
		width: "70%",
	},
});
export default ContactRow;

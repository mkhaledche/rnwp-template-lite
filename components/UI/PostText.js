import React, { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { ThemeContext } from "../../context/context";

//Component for common text props in a post
const PostText = (props) => {
	const [theme] = useContext(ThemeContext);
	const mainStyle = props.title ? styles.titleText : styles.mainText;
	return (
		<Text selectable={true} style={{ ...mainStyle, color: theme.colors.text }}>
			{props.children}
		</Text>
	);
};

const styles = StyleSheet.create({
	mainText: {
		fontSize: 20,
		// fontFamily: "roboto-regular",
		lineHeight: 30,
	},
	titleText: {
		fontSize: 20,
		// fontFamily: "roboto-bold",
	},
});

export default PostText;

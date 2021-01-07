import React, { useContext } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { ThemeContext } from "../../context/context";

// Component to handle safe area in all screens
const ScreenContainer = (props) => {
	const theme = useContext(ThemeContext);

	return (
		<SafeAreaView
			style={{
				...styles.container,
				justifyContent: props.notYet ? "center" : "flex-start",
				backgroundColor: theme[0].colors.background,
			}}>
			{props.children}
		</SafeAreaView>
	);
};

export default ScreenContainer;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flex: 1,
		backgroundColor: "#ece",
		alignItems: "center",
		// alignContent: "center",
	},
});

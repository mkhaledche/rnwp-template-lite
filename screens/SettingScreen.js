import React, { useContext, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { ThemeContext, InternetContext } from "../context/context";
import ScreenContainer from "../components/UI/ScreenContainer";
import SettingSwitch from "../components/UI/SettingSwitch";
import { setSetting } from "../functions/miscFunctions";
import userConfig from "../config/userConfig";

const { lightColors, darkColors } = userConfig;

const SettingScreen = () => {
	const [currentSettings, setCurrentSettings] = useContext(ThemeContext);
	const internetReachable = useContext(InternetContext);

	return (
		<ScreenContainer notYet={false}>
			<View style={styles.settingContainer}>
				<View style={styles.settingTextContainer}>
					<Text style={{ ...styles.text, color: currentSettings.colors.text }}>
						{userConfig.appTexts.darkSetting}
					</Text>
				</View>
				<View style={styles.switchContainer}>
					<SettingSwitch
						value={currentSettings.enabled}
						onValueChange={() => {
							setCurrentSettings({
								...currentSettings,
								enabled: !currentSettings.enabled,
								colors: currentSettings.enabled ? lightColors : darkColors,
							});
							if (currentSettings.enabled == false) {
								setSetting("darkMode", "on");
							} else {
								setSetting("darkMode", "off");
							}
						}}
					/>
				</View>
			</View>
		</ScreenContainer>
	);
};

export default SettingScreen;

const styles = StyleSheet.create({
	settingContainer: {
		width: "100%",
		flexDirection: userConfig.textDirection === "rtl" ? "row-reverse" : "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 20,
	},
	settingTextContainer: {
		marginHorizontal: "10%",
		width: "50%",
	},
	switchContainer: {
		marginHorizontal: "10%",
		width: "20%",
	},
	text: {
		fontSize: 16,
		textAlign: userConfig.textDirection === "rtl" ? "right" : "left",
	},
	touchable: {
		marginTop: 10,
		padding: 10,
		borderRadius: 10,
	},
});

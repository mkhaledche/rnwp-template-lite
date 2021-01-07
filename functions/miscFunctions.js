import { AsyncStorage } from "react-native";
import userConfig from "../config/userConfig";
import { Html5Entities } from "html-entities";

const { lightColors, darkColors } = userConfig;
// Get settings from async storage once the app is loaded
const getSetting = async (current, setTheSetting) => {
	try {
		const darkMode = await AsyncStorage.getItem("darkMode");

		let updatedSettings = {
			...current,
			enabled: darkMode === "on" ? true : false,
			colors: darkMode === "on" ? darkColors : lightColors,
		};

		setTheSetting(updatedSettings);
	} catch (error) {
		console.log("Get settings error:" + error);
	}
};

// Decode all HTML entities to ASCII characters to be shown in the app
const adjustText = (text) => {
	const entities = new Html5Entities();

	entities.decode(text);
	return entities.decode(text);
};

// Set new settings in async storage (used for about page in this file)
const setSetting = async (setting, value) => {
	try {
		await AsyncStorage.setItem(setting, value);
	} catch (error) {
		// Error saving data
		console.log("Set settings error:" + error);
	}
};

//Shall be used to get initial setting (convert on to true and off to false) in SettingScreen
const checkSetting = async (setting, setTheSetting) => {
	try {
		let value = await AsyncStorage.getItem(setting);
		if (value == "off") {
			setTheSetting(false);
		}
	} catch (e) {
		console.log("Check settings error:" + e);
	}
};

//Get the latest posts id stored in the app
const lastStoredPost = async () => {
	try {
		const value = await AsyncStorage.getItem("lastPost");
	} catch (e) {
		console.log("Last stored error:" + e);
	}
};

export { getSetting, adjustText, setSetting, checkSetting, lastStoredPost };

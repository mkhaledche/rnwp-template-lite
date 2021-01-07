import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerNavigator } from "./navigation/AppNavigator";
import { Appearance } from "react-native-appearance";
import { ThemeContext, InternetContext } from "./context/context";
import { getSetting } from "./functions/miscFunctions";
import userConfig from "./config/userConfig";
import {
	AsyncStorage,
	Platform,
	Settings,
	StatusBar,
	Text,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";

const colorScheme = Appearance.getColorScheme();
const { lightColors, darkColors } = userConfig;

export default function App() {
	const initialSettings = {
		enabled: colorScheme === "dark" ? true : false,
		colors: colorScheme === "dark" ? darkColors : lightColors,
	};
	userConfig.postTypes.map((type, index) => {
		initialSettings[type.endPoint] = [];
	});
	userConfig.taxonomies.map((tax, index) => {
		initialSettings[tax.endPoint] = [];
	});

	//Setting main app states once the app is opened before stored data from AsyncStorage is called
	const [currentSettings, setCurrentSettings] = useState(initialSettings);
	const [internetReachable, setInternetReachable] = useState(true);

	//Get the stored settings from AsyncStorage and change the app stated through getSetting function and run applicable ads
	useEffect(() => {
		getSetting(currentSettings, setCurrentSettings);
		if (internetReachable) {
			console.log("reachable");
		}
	}, []);

	//Check if there is an internet connection
	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setInternetReachable(state.isInternetReachable);
		});
	}, [internetReachable]);

	//Return major app components:
	// Context showing all app settings
	// Context showing internet connection setting
	// App status bar
	// Banner Ad as applicable
	// Navigation container showing all app screens
	return (
		<ThemeContext.Provider value={[currentSettings, setCurrentSettings]}>
			<InternetContext.Provider value={internetReachable}>
				<StatusBar
					backgroundColor={
						currentSettings.enabled
							? darkColors.background
							: lightColors.background
					}
					barStyle={currentSettings.enabled ? "light-content" : "dark-content"}
				/>
				<NavigationContainer fallback={<Text>Loading...</Text>}>
					{currentSettings.offline !== "not yet" && <DrawerNavigator />}
				</NavigationContainer>
			</InternetContext.Provider>
		</ThemeContext.Provider>
	);
}

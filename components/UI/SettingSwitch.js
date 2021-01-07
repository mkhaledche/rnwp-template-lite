import React, { useContext } from "react";
import { Switch } from "react-native";
import { ThemeContext } from "../../context/context";

//Component to adjust common props for all switches in setting screen
const SettingSwitch = (props) => {
	const [theme] = useContext(ThemeContext);

	return (
		<Switch
			trackColor={{
				false: theme.colors.falseSwitchColor,
				true: theme.colors.trueSwitchColor,
			}}
			thumbColor={theme.colors.thumbColor}
			onValueChange={props.onValueChange}
			value={props.value}
		/>
	);
};

export default SettingSwitch;

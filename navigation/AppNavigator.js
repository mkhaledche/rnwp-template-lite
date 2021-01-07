import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AllPostScreen, {
	screenOptions as postOptions,
} from "../screens/AllPostScreen";
import SinglePostScreen, {
	screenOptions as singlePostOptions,
} from "../screens/SinglePostScreen";
import AllCatScreen, {
	screenOptions as allCatOptions,
} from "../screens/AllCatScreen";
import SearchScreen, {
	screenOptions as searchOptions,
} from "../screens/SearchScreen";
import SettingScreen, {
	screenOptions as settingOptions,
} from "../screens/SettingScreen";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View } from "react-native";
import { ThemeContext } from "../context/context";
import { createDrawerNavigator } from "@react-navigation/drawer";
import userConfig from "../config/userConfig";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

const Tab = createMaterialBottomTabNavigator();

const PostStack = createStackNavigator();

const AllPostStack = createStackNavigator();

const SettingStack = createStackNavigator();

const Drawer = createDrawerNavigator();

const defaultOptions = ({ navigation, route }, theme) => {
	const searchIcon = () => (
		<Button
			onPress={() => {
				navigation.navigate("Search");
			}}
			title="Search">
			<Ionicons
				name={Platform.OS === "android" ? "md-search" : "ios-search"}
				size={25}
				color={theme.colors.text}
			/>
		</Button>
	);
	const menuAndBack = () => (
		<View
			style={{
				flexDirection:
					userConfig.textDirection == "rtl" ? "row-reverse" : "row",
			}}>
			<View
				style={{
					width: "30%",
					marginRight: userConfig.textDirection == "rtl" ? 15 : 0,
				}}>
				<Button
					onPress={() => {
						navigation.openDrawer();
					}}
					title="Update count">
					<Ionicons
						name={Platform.OS === "android" ? "md-menu" : "ios-menu"}
						size={25}
						color={theme.colors.text}
					/>
				</Button>
			</View>
			<View style={{ width: "30%" }}>
				<BackButton />
			</View>
		</View>
	);
	return {
		headerStyle: {
			backgroundColor: theme.colors.background,
		},
		headerTitleStyle: {
			color: theme.colors.text,
			alignSelf: "center",
			marginLeft: userConfig.textDirection == "rtl" ? 0 : 20,
			marginRight: userConfig.textDirection == "rtl" ? 20 : 0,
		},
		headerRight: userConfig.textDirection == "rtl" ? menuAndBack : searchIcon,
		headerLeft: userConfig.textDirection == "rtl" ? searchIcon : menuAndBack,
	};
};
const BackButton = () => {
	const navigation = useNavigation();
	const [theme] = useContext(ThemeContext);
	const canGoBack = navigation.canGoBack();
	const arrowDirection = userConfig.textDirection == "rtl" ? "forward" : "back";

	return (
		<Button
			onPress={() => {
				if (canGoBack) {
					navigation.goBack();
				}
			}}
			title="Back">
			<Ionicons
				name={
					Platform.OS === "android"
						? `md-arrow-${arrowDirection}`
						: `ios-arrow-${arrowDirection}`
				}
				size={25}
				color={canGoBack ? theme.colors.text : theme.colors.background}
			/>
		</Button>
	);
};
const TabNavigator = (props) => {
	const [theme] = useContext(ThemeContext);
	const { taxonomy, postType } = props.route.params;
	const { navigation, route } = props;
	const defaultNavOptions = defaultOptions({ navigation, route }, theme);
	const screens = [
		{
			name: userConfig.appTexts.homeScreenName,
			component: AppNavigator,
			options: {
				tabBarIcon: ({ color, size }) => {
					return <Ionicons name="ios-home" color={color} size={22} />;
				},
			},
			initialParams: { theme, taxonomy, postType },
		},
		{
			name: userConfig.appTexts.settingScreenName,
			component: SettingNavigator,
			options: {
				tabBarIcon: ({ color, size }) => {
					return <Ionicons name="ios-settings" color={color} size={22} />;
				},
			},
			initialParams: { theme },
		},
	];
	const screenArrangement =
		userConfig.textDirection == "rtl" ? screens.reverse() : screens;
	return (
		<Tab.Navigator
			activeColor={theme.colors.text}
			inactiveColor={theme.colors.textAlt}
			barStyle={{
				backgroundColor: theme.colors.background,
			}}
			shifting={true}
			screenOptions={defaultNavOptions}
			initialRouteName={userConfig.appTexts.homeScreenName}>
			{screenArrangement.map((screen, index) => (
				<Tab.Screen
					name={screen.name}
					component={screen.component}
					options={screen.options}
					initialParams={screen.initialParams}
					key={index}
				/>
			))}
		</Tab.Navigator>
	);
};

const DrawerNavigator = (props) => {
	const { postTypes, taxonomies } = userConfig;
	const [theme] = useContext(ThemeContext);
	const { navigation, route } = props;
	const defaultNavOptions = defaultOptions({ navigation, route }, theme);

	return (
		<Drawer.Navigator
			initialRouteName={userConfig.appTexts.homeScreenName}
			drawerStyle={{
				backgroundColor: theme.colors.background,
			}}
			drawerContentOptions={{
				activeBackgroundColor: theme.colors.containerColor,
				activeTintColor: theme.colors.text,
				inactiveTintColor: theme.colors.text,
				// itemStyle: {
				// 	flexDirection:
				// 		userConfig.textDirection == "rtl" ? "row-reverse" : "row",
				// 	width: "100%",
				// },
				labelStyle: {
					color: theme.colors.text,
				},
			}}
			drawerPosition={userConfig.textDirection == "rtl" ? "right" : "left"}
			drawerType="back"
			options={{
				drawerIcon: ({ color, size }) => {
					return <Ionicons name="ios-menu" color={color} size={22} />;
				},
			}}>
			{!userConfig.postsFirst &&
				taxonomies.map((taxonomy, index) => (
					<Drawer.Screen
						name={taxonomy.name}
						component={TabNavigator}
						initialParams={{ taxonomy, postType: null }}
						key={index}
					/>
				))}
			{!userConfig.postsFirst &&
				postTypes.map((postType, index) => (
					<Drawer.Screen
						name={postType.name}
						component={PostNavigator}
						initialParams={{ postType, taxonomy: null }}
						key={index}
					/>
				))}
			{userConfig.postsFirst &&
				postTypes.map((postType, index) => (
					<Drawer.Screen
						name={postType.name}
						component={TabNavigator}
						initialParams={{ postType, taxonomy: null }}
						key={index}
					/>
				))}
			{userConfig.postsFirst &&
				taxonomies.map((taxonomy, index) => (
					<Drawer.Screen
						name={taxonomy.name}
						component={PostNavigator}
						initialParams={{
							taxonomy,
							postType: taxonomy.postType,
						}}
						key={index}
					/>
				))}
		</Drawer.Navigator>
	);
};

const AppNavigator = (props) => {
	const [theme] = useContext(ThemeContext);
	const { params } = props.route;
	const { navigation, route } = props;
	const defaultNavOptions = defaultOptions({ navigation, route }, theme);

	return (
		<PostStack.Navigator screenOptions={defaultNavOptions}>
			{!userConfig.postsFirst && (
				<PostStack.Screen
					name={params.taxonomy.name}
					component={AllCatScreen}
					options={allCatOptions}
					initialParams={{ theme, taxonomy: params.taxonomy }}
				/>
			)}
			{!userConfig.postsFirst && (
				<PostStack.Screen
					name="Posts"
					component={AllPostScreen}
					options={postOptions}
					initialParams={{ theme }}
				/>
			)}
			{userConfig.postsFirst && (
				<PostStack.Screen
					name="Posts"
					component={AllPostScreen}
					options={postOptions}
					initialParams={{ theme, postType: params.postType }}
				/>
			)}
			<PostStack.Screen
				name="Single"
				component={SinglePostScreen}
				options={singlePostOptions}
				initialParams={{ theme }}
			/>
			<PostStack.Screen
				name="Search"
				component={SearchScreen}
				options={searchOptions}
				initialParams={{ theme }}
			/>
		</PostStack.Navigator>
	);
};

const PostNavigator = (props) => {
	const [theme] = useContext(ThemeContext);
	const { postType, taxonomy } = props.route.params;
	const { navigation, route } = props;
	const defaultNavOptions = defaultOptions({ navigation, route }, theme);

	return (
		<AllPostStack.Navigator screenOptions={defaultNavOptions}>
			{userConfig.postsFirst && (
				<AllPostStack.Screen
					name={taxonomy.name}
					component={AllCatScreen}
					options={allCatOptions}
					initialParams={{
						theme,
						postType,
						taxonomy,
					}}
				/>
			)}
			<AllPostStack.Screen
				name="Posts"
				component={AllPostScreen}
				options={postOptions}
				initialParams={{ theme, postType }}
			/>
			<AllPostStack.Screen
				name="Single"
				component={SinglePostScreen}
				options={singlePostOptions}
				initialParams={{ theme }}
			/>
			<AllPostStack.Screen
				name="Search"
				component={SearchScreen}
				options={searchOptions}
				initialParams={{ theme }}
			/>
		</AllPostStack.Navigator>
	);
};

const SettingNavigator = (props) => {
	const [theme] = useContext(ThemeContext);
	const { navigation, route } = props;
	const defaultNavOptions = defaultOptions({ navigation, route }, theme);

	return (
		<SettingStack.Navigator screenOptions={defaultNavOptions}>
			<SettingStack.Screen
				name={userConfig.appTexts.settingScreenName}
				component={SettingScreen}
				options={settingOptions}
				initialParams={{ theme }}
			/>
		</SettingStack.Navigator>
	);
};
export { AppNavigator, TabNavigator, DrawerNavigator };

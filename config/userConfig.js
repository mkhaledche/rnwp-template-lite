export default userConfig = {
	siteURL: "https://boostrand.com",
	postTypes: [
		{
			name: "Posts",
			endPoint: "posts",
		},
		{
			name: "Pages",
			endPoint: "pages",
		},
	],
	taxonomies: [
		{
			name: "Categories",
			endPoint: "categories",
			postType: "posts",
		},
	],
	excludedPostIDs: [1],
	excludedCatIDs: [1],
	offlinePostsPerPage: 100,
	onlinePostsPerPage: 5,
	offlineCatsPerPage: 100,
	onlineCatsPerPage: 5,
	searchPerPage: 5,
	numberOfPostsToDownload: 100,
	postsFirst: true,
	pluginInstalled: true,
	aboutPage: { postType: "undefined", id: 0 },
	searchPostType: "posts",
	supportsExcerpt: false,
	excerptMaxChar: 500,
	supportsFeaturedImage: false,
	enableFirebase: false,
	enableBannerAds: false,
	bannerAdsKey: "",
	enableInterstitialAds: false,
	interstitialAdsKey: "",
	enableRewardedAds: false,
	rewardedAdsKey: "",
	pnPluginInstalled: false,
	enableScheduled: false,
	scheduledNotificationFrequency: 1,
	textDirection: "ltr",
	contact: {
		telephone: {
			string: "Telephone No.:",
			value: "",
		},
		address: {
			string: "Address:",
			value: "",
		},
		mail: {
			string: "Email:",
			value: "",
		},
		social: [],
	},
	lightColors: {
		background: "#f4eeff",
		border: "#bdbdbd",
		backgroundAlt: "#bdbdbd",
		borderAlt: "#bdbdbd",
		text: "#424874",
		textAlt: "#a6b1e1",
		containerColor: "#c3cafd",
		thumbColor: "#424874",
		trueSwitchColor: "#a6b1e1",
		falseSwitchColor: "#dcd6f7",
	},
	darkColors: {
		background: "#424874",
		border: "#a6b1e1",
		backgroundAlt: "#575c66",
		borderAlt: "#2e3440",
		text: "#f4eeff",
		textAlt: "#dcd6f7",
		containerColor: "#5d659f",
		thumbColor: "#a6b1e1",
		trueSwitchColor: "#dcd6f7",
		falseSwitchColor: "#f4eeff",
	},
	appTexts: {
		scheduledNotificationTitle: "We miss you!",
		scheduledNotificationBody: "Check our new data",
		homeScreenName: "Home",
		savedScreenName: "Saved",
		contactScreenName: "Contact us",
		aboutScreenName: "About Us",
		searchScreenName: "Search",
		settingScreenName: "Settings",
		noInternet: "There is no internet connection.",
		onlineSearch: "Online Search (More flexibile)",
		noResults: "No search results found.",
		darkSetting: "Enable dark mode",
		notificationSetting: "Enable notifications",
		offlineSetting: "Enable offline mode",
		checkUpdatesBtn: "Check updates",
		downloadingStatement: "Downloading...",
		doneStatement: "Done.",
		seeProductPage: "See Product Page",
		deleteDataAlert: {
			title: "Delete data",
			message: "Do you want to delete the data?",
		},
		downloadDataAlert: {
			title: "Download data",
			message: "Do you want to download the data?",
		},
		alertPrompt: {
			yes: "Yes",
			no: "No",
		},
	},
};
export default function reducer(state, action) {
	switch (action.type) {
		case "nextPost": {
			return { ...state, postPage: state.postPage + 1 };
		}
		case "nextCat": {
			return { ...state, catPage: state.catPage + 1 };
		}
		default:
			throw new Error();
	}
}

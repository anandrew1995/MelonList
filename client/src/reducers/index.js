import { combineReducers } from "redux";

import chart from "reducers/chartReducer";
import user from "reducers/userReducer";
import exporter from "reducers/exporterReducer";

export default combineReducers({
	chart,
	user,
	exporter,
});

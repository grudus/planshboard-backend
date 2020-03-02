import { combineReducers } from "redux";

const rootReducer = combineReducers({
    tempIgnoreReduxWarnings: state => state || null,
});

export default rootReducer;

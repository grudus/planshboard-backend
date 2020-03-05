import { all } from "redux-saga/effects";
import changeLanguageSaga from "./changeLanguageSaga";

function* rootLocaleSaga(): Generator {
    yield all([changeLanguageSaga()]);
}

export default rootLocaleSaga;

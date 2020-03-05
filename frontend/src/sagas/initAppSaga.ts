import { put, take } from "redux-saga/effects";
import { changeLanguage, changeLanguageSuccess } from "../app/locale/store/localeActions";

export default function* initApp(): Generator {
    yield put(changeLanguage("pl"));
    yield take(changeLanguageSuccess.type);
    yield put({ type: "APP_INITIALIZED" });
}

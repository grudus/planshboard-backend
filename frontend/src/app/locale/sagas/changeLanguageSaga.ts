import { takeEvery, put, call } from "redux-saga/effects";
import { changeLanguage, changeLanguageSuccess } from "../store/localeActions";
import { PayloadAction } from "@reduxjs/toolkit";
import { Language } from "../store/localeStore";

const getTranslations = async (lang: string) => {
    const awaitedImport = await import(`../language-${lang}.json`);
    return awaitedImport.default;
};

// TODO Download translations on demand
function* doChangeLanguage(action: PayloadAction<Language>): Generator {
    const translation = yield call(getTranslations, action.payload);
    yield put(changeLanguageSuccess(action.payload, translation));
}

export default function* changeLocaleSaga(): Generator {
    yield takeEvery(changeLanguage.type, doChangeLanguage);
}

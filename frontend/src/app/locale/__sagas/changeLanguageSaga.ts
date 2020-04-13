import { call, put, takeEvery } from "redux-saga/effects";
import { changeLanguage, changeLanguageSuccess } from "../__store/localeActions";
import { PayloadAction } from "@reduxjs/toolkit";
import { Language, Translations } from "../__store/localeStore";

const getTranslations = async (lang: string): Promise<Translations> => {
    const awaitedImport = await import(`../language-${lang}.json`);
    return awaitedImport.default;
};

function* doChangeLanguage(action: PayloadAction<Language>): Generator {
    const translation = yield call(getTranslations, action.payload);
    yield put(changeLanguageSuccess(action.payload, translation));
}

export default function* changeLocaleSaga(): Generator {
    yield takeEvery(changeLanguage.type, doChangeLanguage);
}

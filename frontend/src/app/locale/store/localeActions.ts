import { createAction, PrepareAction } from "@reduxjs/toolkit";
import { Language, Translations } from "./localeStore";

export const changeLanguage = createAction("CHANGE_LANGUAGE", (language: Language) => ({
    payload: language,
}));

export interface ChangeLanguageSuccessPayload {
    language: Language;
    translations: any;
}

export const changeLanguageSuccess = createAction<PrepareAction<ChangeLanguageSuccessPayload>>(
    "CHANGE_LANGUAGE_SUCCESS",
    (language: Language, translations: Translations) => ({
        payload: { language, translations },
    }),
);

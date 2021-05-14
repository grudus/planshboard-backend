import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { changeLanguageSuccess, ChangeLanguageSuccessPayload } from "./localeActions";

export type Translations = { [key: string]: Record<string, any> | string };
export type Language = "en" | "pl";

export interface LocaleStore {
    possibleLanguages: Language[];
    language: Language;
    translations: Translations;
    translationsLoaded: boolean;
}

const initialState: LocaleStore = {
    language: "pl",
    translations: {},
    possibleLanguages: ["en", "pl"],
    translationsLoaded: false,
};

export const localeReducer = createReducer(initialState, {
    [changeLanguageSuccess.type]: (state, action: PayloadAction<ChangeLanguageSuccessPayload>) => {
        state.language = action.payload.language;
        state.translations = action.payload.translations;
        state.translationsLoaded = true;
    },
});

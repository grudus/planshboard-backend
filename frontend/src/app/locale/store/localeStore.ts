import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { changeLanguageSuccess, ChangeLanguageSuccessPayload } from "./localeActions";

export type Translations = { [key: string]: object };
export type Language = "en" | "pl";

export interface LocaleStore {
    possibleLanguages: Language[];
    language: Language;
    translations: Translations;
}

const initialState: LocaleStore = {
    language: "pl",
    translations: {},
    possibleLanguages: ["en", "pl"],
};

export const localeReducer = createReducer(initialState, {
    [changeLanguageSuccess.type]: (state, action: PayloadAction<ChangeLanguageSuccessPayload>) => {
        state.language = action.payload.language;
        state.translations = action.payload.translations;
    },
});

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Language = "en" | "pl";

interface LocaleStore {
    language: Language,
}

const initialState: LocaleStore = { language: "en" };

const localeSlice = createSlice({
    name: "locale",
    initialState: initialState,
    reducers: {
        changeLanguage: (state: LocaleStore, action: PayloadAction<Language>) => {
            return { ...state, language: action.payload };
        },
    },
});

export const localeReducer = localeSlice.reducer;
export const localeActions = localeSlice.actions;


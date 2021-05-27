import { createAsyncThunk } from "@reduxjs/toolkit";
import { Language, Translations } from "./localeStore";

const changeLanguage = createAsyncThunk("CHANGE_LANGUAGE", async (language: Language, thunkAPI) => {
    const newLanguage = await import(`../language-${language}.json`);
    const translations = newLanguage.default as Translations;
    return { language, translations };
});

const LocaleActions = {
    changeLanguage,
};

export default LocaleActions;

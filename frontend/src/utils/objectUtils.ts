import { Translations } from "app/locale/store/localeStore";

export const getNestedTranslation = (key: string, translations: Translations): string => {
    const nestedObject = key.split(".").reduce((translation, key) => translation?.[key] as Translations, translations);

    if (typeof nestedObject == "object") {
        return JSON.stringify(nestedObject);
    }
    return nestedObject ?? key;
};

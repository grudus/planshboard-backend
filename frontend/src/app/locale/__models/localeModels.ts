import { Language } from "app/locale/__store/localeStore";

export interface ChangeLanguageSuccess {
    language: Language;
    translations: any;
}

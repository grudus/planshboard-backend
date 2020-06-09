import { useCallback } from "react";
import { useRedux } from "store/rootReducer";
import { getNestedTranslation } from "utils/objectUtils";
import { memoize } from "lodash";
import { Translations } from "app/locale/__store/localeStore";

const performTranslate = (key: string, translations: Translations): string =>
    key && getNestedTranslation(key, translations);

export const memoizedTranslation = memoize(performTranslate);

const useTranslations = (): { translate: Function } => {
    const { translations } = useRedux(state => state.locale);

    const cachedTranslate = useCallback(key => memoizedTranslation(key, translations), [translations]);
    return { translate: cachedTranslate };
};

export default useTranslations;

import React from "react";
import { useRedux } from "../../../store/rootReducer";
import { getNestedTranslation } from "../../../utils/objectUtils";

const useTranslations = () => {
    const { translations } = useRedux(state => state.locale);

    const translate = React.useCallback((key: string) => getNestedTranslation(key, translations), [translations]);
    return { translate };
};

export default useTranslations;

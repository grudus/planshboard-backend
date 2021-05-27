import React, { useEffect } from "react";
import { useRedux } from "store/rootReducer";
import { useAppDispatch } from "store/useAppDispatch";
import LocaleActions from "app/locale/__store/localeActions";

const LocaleLoadedGuard: React.FC = props => {
    const { translationsLoaded } = useRedux(state => state.locale);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(LocaleActions.changeLanguage("pl"));
    }, [dispatch]);

    return translationsLoaded ? <>{props.children}</> : <div />;
};

export default LocaleLoadedGuard;

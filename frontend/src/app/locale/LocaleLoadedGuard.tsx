import React from "react";
import { useRedux } from "store/rootReducer";

const LocaleLoadedGuard: React.FC = props => {
    const { translationsLoaded } = useRedux(state => state.locale);

    return translationsLoaded ? <>{props.children}</> : <div />;
};

export default LocaleLoadedGuard;

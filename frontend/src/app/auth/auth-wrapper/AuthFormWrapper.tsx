import React from "react";
import css from "./auth-wrapper.module.scss";
import { merge } from "../../../utils/cssUtils";
import useTranslations from "../../locale/hooks/useTranslations";

const AuthFormWrapper: React.FC = props => {
    const { translate } = useTranslations();

    return (
        <div className={css.wrapper}>
            <div className={merge(css.halfItem, css.image)}>{translate("APP_TITLE")}</div>
            <div className={css.halfItem}>{props.children}</div>
        </div>
    );
};

export default AuthFormWrapper;

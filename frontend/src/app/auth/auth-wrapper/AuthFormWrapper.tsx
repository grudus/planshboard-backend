import React from "react";
import css from "./auth-wrapper.module.scss";
import { merge } from "../../../utils/cssUtils";

const AuthFormWrapper: React.FC = props => {
    return (
        <div className={css.wrapper}>
            <div className={merge(css.halfItem, css.image)} />
            <div className={css.halfItem}>{props.children}</div>
        </div>
    );
};

export default AuthFormWrapper;

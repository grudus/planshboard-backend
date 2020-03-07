import React from "react";
import css from "./auth-wrapper.module.scss";
import { merge } from "utils/cssUtils";

interface AuthFormWrapperProps {
    image: string;
    text: string;
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = props => {
    return (
        <div className={css.wrapper}>
            <section className={merge(css.imageWrapper)}>
                <h2 className={css.imageTitle}>{props.text}</h2>
                <img className={css.image} src={props.image} alt="Login welcome" />
            </section>
            <div className={merge(css.form)}>{props.children}</div>
        </div>
    );
};

export default AuthFormWrapper;

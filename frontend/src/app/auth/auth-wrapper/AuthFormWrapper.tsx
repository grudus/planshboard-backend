import React from "react";
import css from "./auth-wrapper.module.scss";
import { merge } from "utils/cssUtils";
import Heading from "library/text/Heading";

interface AuthFormWrapperProps {
    image: string;
    text: string;
    children: React.ReactNode;
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = props => (
    <div className={css.wrapper}>
        <section className={merge(css.imageWrapper)}>
            <Heading variant="h1" className={css.imageTitle} center text={props.text} />
            <img className={css.image} src={props.image} alt="Login welcome" />
        </section>
        <div className={merge(css.form)}>{props.children}</div>
    </div>
);

export default React.memo(AuthFormWrapper);

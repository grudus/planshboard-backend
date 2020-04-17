import React from "react";
import css from "library/card-form/card-form.module.scss";

export interface CardFormTitleProps {
    children?: React.ReactNode;
}

const CardFormTitle: React.FC<CardFormTitleProps> = props => (
    <header className={css.header}>
        <h1>{props.children}</h1>
    </header>
);

export default React.memo(CardFormTitle);

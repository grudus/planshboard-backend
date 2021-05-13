import React from "react";
import css from "library/card-form/card-form.module.scss";

export interface CardFormTitleProps {
    children?: React.ReactNode;
}

const CardFormTitle: React.FC<CardFormTitleProps> = props => <header className={css.header}>{props.children}</header>;

export default CardFormTitle;

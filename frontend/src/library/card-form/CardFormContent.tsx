import React from "react";
import css from "library/card-form/card-form.module.scss";

export interface CardFormContentProps {
    children?: React.ReactNode;
}

const CardFormContent: React.FC<CardFormContentProps> = props => <div className={css.content}>{props.children}</div>;

export default React.memo(CardFormContent);

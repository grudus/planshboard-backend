import React from "react";
import css from "library/card-form/card-form.module.scss";
import { merge } from "utils/cssUtils";

export interface CardFormProps {
    children?: React.ReactNode;
    className?: string;
}

const CardForm: React.FC<CardFormProps> = props => (
    <section className={merge(css.section, props.className)}>{props.children}</section>
);

export default React.memo(CardForm);

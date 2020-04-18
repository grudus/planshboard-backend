import React from "react";
import css from "library/card-form/card-form.module.scss";
import { merge } from "utils/cssUtils";

export interface CardFormContentProps {
    children?: React.ReactNode;
    className?: string;
}

const CardFormContent: React.FC<CardFormContentProps> = props => (
    <div className={merge(css.content, props.className)}>{props.children}</div>
);

export default React.memo(CardFormContent);

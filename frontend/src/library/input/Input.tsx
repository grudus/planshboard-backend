import React, { ChangeEvent, ReactElement, useState } from "react";
import css from "./input.module.scss";
import useTranslations from "app/locale/hooks/useTranslations";
import { cssIf, merge } from "utils/cssUtils";

export interface InputProps {
    initialValue?: string;
    onChange?: (a: string) => void;
    autoFocus?: boolean;
    frontIcon?: ReactElement;
    actionIcon?: ReactElement;
    type?: string;
    labelKey: string;
    errorKey?: string;
}

const Input: React.FC<InputProps> = props => {
    const { translate } = useTranslations();
    const [text, setText] = useState(props.initialValue || "");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setText(value);
        props?.onChange?.(value);
    };

    const isError = () => !!props.errorKey;

    return (
        <div className={merge(css.wrapper, cssIf(css.error, isError()))}>
            {props.frontIcon && React.cloneElement(props.frontIcon, { className: css.frontIcon })}
            <input
                id={props.labelKey}
                value={text}
                onChange={handleChange}
                className={css.input}
                autoFocus={props.autoFocus}
                type={props.type || "text"}
                aria-invalid={isError()}
            />
            <label className={merge(css.label, cssIf(css.labelUp, !!text))} htmlFor={props.labelKey}>
                {translate(props.labelKey)}
            </label>
            {isError() && <span className={css.errorMessage}>{translate(props.errorKey ?? "")}</span>}
            {props.actionIcon && React.cloneElement(props.actionIcon, { className: css.actionIcon })}
        </div>
    );
};

export default React.memo(Input);

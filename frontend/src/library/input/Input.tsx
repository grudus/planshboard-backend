import React, { ChangeEvent, ReactElement, useState } from "react";
import css from "./input.module.scss";
import { cssIf, merge } from "utils/cssUtils";

export type InputType = "text" | "password";

export interface InputProps {
    label: string;
    name: string;
    initialValue?: string;
    onChange?: (a: string) => void;
    autoFocus?: boolean;
    frontIcon?: ReactElement;
    actionIcon?: ReactElement;
    type?: InputType;
    error?: string;
}

const Input: React.FC<InputProps> = props => {
    const [text, setText] = useState(props.initialValue || "");

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        setText(value);
        props?.onChange?.(value);
    };

    const isError = (): boolean => !!props.error;

    return (
        <div className={merge(css.wrapper, cssIf(css.error, isError()))}>
            {props.frontIcon && React.cloneElement(props.frontIcon, { className: css.frontIcon })}
            <input
                id={props.name}
                name={props.name}
                value={text}
                onChange={handleChange}
                className={css.input}
                autoFocus={props.autoFocus}
                type={props.type || "text"}
                aria-invalid={isError()}
            />
            <label className={merge(css.label, cssIf(css.labelUp, !!text))} htmlFor={props.name}>
                {props.label}
            </label>
            {isError() && (
                <span role="alert" className={css.errorMessage}>
                    {props.error}
                </span>
            )}
            {props.actionIcon && React.cloneElement(props.actionIcon, { className: css.actionIcon })}
        </div>
    );
};

export default React.memo(Input);

import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import css from "./input.module.scss";
import { cssIf, merge } from "utils/cssUtils";

export type InputType = "text" | "password" | "number";

export interface InputProps {
    label?: string;
    size?: "small" | "normal";
    name: string;
    initialValue?: string;
    onTextChange?: (a: string) => void;
    autoFocus?: boolean;
    frontIcon?: ReactElement;
    actionIcon?: ReactElement | false;
    type?: InputType;
    error?: string;
    className?: string;
    onBlur?: ((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | undefined;
    multiline?: boolean;
}

const Input: React.FC<InputProps> = props => {
    const [text, setText] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { value } = e.target;
        setText(value);
        props?.onTextChange?.(value);
    };

    useEffect(() => {
        setText(props.initialValue || "");
    }, [props.initialValue]);

    const isError = (): boolean => !!props.error;

    const inputElement = props.multiline ? (
        <textarea
            id={props.name}
            name={props.name}
            value={text}
            onChange={handleChange}
            className={css.input}
            autoFocus={props.autoFocus}
            onBlur={props.onBlur}
            aria-invalid={isError()}
            rows={1}
        />
    ) : (
        <input
            id={props.name}
            name={props.name}
            value={text}
            onChange={handleChange}
            className={css.input}
            autoFocus={props.autoFocus}
            type={props.type || "text"}
            onBlur={props.onBlur}
            aria-invalid={isError()}
        />
    );

    return (
        <div className={merge(css.wrapper, cssIf(css.error, isError()), css[props.size ?? "normal"], props.className)}>
            {props.frontIcon && React.cloneElement(props.frontIcon, { className: css.frontIcon })}
            {inputElement}
            <label className={merge(css.label, cssIf(css.labelUp, !!text))} htmlFor={props.name}>
                {props.label}
            </label>
            {isError() && (
                <span role="alert" className={css.errorMessage}>
                    {props.error}
                </span>
            )}
            {props.actionIcon &&
                React.cloneElement(props.actionIcon, {
                    className: merge(css.actionIcon, props.actionIcon.props.className),
                })}
        </div>
    );
};

export default React.memo(Input);

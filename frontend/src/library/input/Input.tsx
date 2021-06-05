import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import css from "./input.module.scss";
import { cssIf, merge } from "utils/cssUtils";
import useTranslations from "app/locale/__hooks/useTranslations";

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
    inputExtra?: React.HTMLProps<HTMLInputElement>;
    hideLabel?: boolean;
    placeholder?: string;
    onEnter?: (text: string) => void;
}

const Input: React.FC<InputProps> = props => {
    const [text, setText] = useState("");
    const { translate } = useTranslations();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { value } = e.target;
        setText(value);
        props?.onTextChange?.(value);
    };

    const handleKey = (e: React.KeyboardEvent<any>) => {
        const { key } = e;
        if (key === "Enter") {
            props.onEnter?.(text);
        }
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
            onKeyDown={handleKey}
            placeholder={props.placeholder}
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
            onKeyDown={handleKey}
            placeholder={props.placeholder}
            {...props.inputExtra}
        />
    );

    return (
        <div className={merge(css.wrapper, cssIf(css.error, isError()), css[props.size ?? "normal"], props.className)}>
            <label className={merge(css.label, cssIf(css.hideLabel, !!props.hideLabel))} htmlFor={props.name}>
                {props.label ? translate(props.label) : null}
            </label>

            <div className={css.inputWithIconsWrapper}>
                {props.frontIcon && React.cloneElement(props.frontIcon, { className: css.frontIcon })}
                {inputElement}
                {props.actionIcon &&
                    React.cloneElement(props.actionIcon, {
                        className: merge(css.actionIcon, props.actionIcon.props.className),
                    })}
            </div>

            <span role="alert" className={merge(css.errorMessage, cssIf(css.showError, isError()))}>
                {props.error ? translate(props.error) : null}
            </span>
        </div>
    );
};

export default React.memo(Input);

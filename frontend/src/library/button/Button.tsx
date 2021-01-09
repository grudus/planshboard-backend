import React, { ReactElement } from "react";
import css from "./button.module.scss";
import { cssIf, merge } from "utils/cssUtils";
import RingLoading from "library/loading/RingLoading";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    color?: "primary" | "accent" | "normal";
    decoration?: "solid" | "outlined";
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: ReactElement;
}

const Button: React.FC<ButtonProps> = props => {
    const {
        className,
        onClick,
        type,
        text,
        fullWidth,
        disabled,
        loading,
        leftIcon,
        decoration,
        ...buttonProps
    } = props;
    const classes = merge(
        css.button,
        css[props.color || "primary"],
        cssIf(css.fullWidth, !!props.fullWidth),
        cssIf(css.loading, !!loading),
        cssIf(css.solid, !decoration || decoration === "solid"),
        cssIf(css.outlined, decoration === "outlined"),
        className,
    );
    return (
        <button
            className={classes}
            disabled={disabled || loading}
            onClick={props.onClick}
            type={props.type || "button"}
            {...buttonProps}
        >
            <span className={css.insideButton}>
                {leftIcon}
                {props.text}
                {loading && <RingLoading className={merge(css.loader, css[props.color || "primary"])} />}
            </span>
        </button>
    );
};

export default React.memo(Button);

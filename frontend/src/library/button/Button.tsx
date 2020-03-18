import React from "react";
import css from "./button.module.scss";
import { cssIf, merge } from "utils/cssUtils";
import RingLoading from "library/loading/RingLoading";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    color?: "primary" | "accent";
    fullWidth?: boolean;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = props => {
    const { className, onClick, type, text, fullWidth, ...buttonProps } = props;
    const classes = merge(
        css.button,
        css[props.color || "primary"],
        cssIf(css.fullWidth, !!props.fullWidth),
        cssIf(css.loading, !!props.loading),
        className || "",
    );
    return (
        <button className={classes} disabled={props.loading} onClick={props.onClick} type={props.type} {...buttonProps}>
            {props.text}
            {props.loading && <RingLoading className={css.loader} />}
        </button>
    );
};

export default React.memo(Button);

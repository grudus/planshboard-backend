import React from "react";
import css from "./button.module.scss";
import { cssIf, merge } from "utils/cssUtils";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    color?: "primary" | "accent";
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = props => {
    const { className, onClick, type, text, fullWidth, ...buttonProps } = props;
    const classes = merge(
        css.button,
        css[props.color || "primary"],
        cssIf(css.fullWidth, !!props.fullWidth),
        className || "",
    );
    return (
        <button className={classes} onClick={props.onClick} type={props.type} {...buttonProps}>
            {props.text}
        </button>
    );
};

export default React.memo(Button);

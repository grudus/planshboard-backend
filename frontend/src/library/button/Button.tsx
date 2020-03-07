import React from "react";
import useTranslations from "app/locale/hooks/useTranslations";
import css from "./button.module.scss";
import { cssIf, merge } from "utils/cssUtils";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    textKey: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    color?: "primary" | "accent";
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = props => {
    console.log("@@@@@@@@ Button render");
    const { translate } = useTranslations();
    const { className, onClick, type, textKey, fullWidth, ...buttonProps } = props;
    const classes = merge(
        css.button,
        css[props.color || "primary"],
        cssIf(css.fullWidth, !!props.fullWidth),
        className || "",
    );
    return (
        <button className={classes} onClick={props.onClick} type={props.type} {...buttonProps}>
            {translate(props.textKey)}
        </button>
    );
};

export default React.memo(Button);

import React from "react";
import css from "./chip.module.scss";
import { cssIf, merge } from "utils/cssUtils";

interface ChipProps {
    text: string;
    onClick?: () => void;
    color?: "normal";
    disabled?: boolean;
    className?: string;
}

const Chip: React.FC<ChipProps> = props => {
    const classes = merge(
        css.chip,
        css[props.color ?? "normal"],
        cssIf(css.clickable, !!props.onClick),
        props.className,
    );
    return (
        <button disabled={props.disabled} className={classes} onClick={props.onClick}>
            {props.text}
        </button>
    );
};

export default React.memo(Chip);

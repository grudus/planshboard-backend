import React from "react";
import css from "./tag.module.scss";
import { merge } from "utils/cssUtils";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";

interface TagProps {
    text: string;
    color?: "primary" | "accent";
    className?: string;
    onClose?: () => void;
    onCloseButtonProps?: React.HTMLProps<HTMLButtonElement>;
}

const Tag: React.FC<TagProps> = props => {
    const classes = merge(
        css.tag,
        css[props.color ?? "primary"],
        !!props.onClose ? css.closeable : "",
        props.className,
    );
    return (
        <div className={classes}>
            <span>{props.text}</span>
            {props.onClose && (
                <IconButton
                    svgIcon={Icons.CloseIcon}
                    className={css.closeIcon}
                    {...props.onCloseButtonProps}
                    onClick={props.onClose}
                />
            )}
        </div>
    );
};

export default Tag;

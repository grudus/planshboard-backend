import React, { forwardRef, ReactElement } from "react";
import { merge } from "utils/cssUtils";
import css from "./icon-button.module.scss";

interface IconButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    svgIcon: ReactElement;
    className?: string;
}

const IconButton: React.FC<IconButtonProps> = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
    const { onClick, svgIcon, className, ...buttonProps } = props;
    const classes = merge(css.button, className);

    const click = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event?.stopPropagation();
        event?.preventDefault();
        onClick?.(event);
    };
    return (
        <button className={classes} onClick={click} {...buttonProps} ref={ref} type="button">
            <span className={css.iconWrapper}>{svgIcon}</span>
        </button>
    );
});

export default React.memo(IconButton);

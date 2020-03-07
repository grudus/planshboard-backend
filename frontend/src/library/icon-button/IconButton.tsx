import React, { ReactElement } from "react";
import { merge } from "utils/cssUtils";
import css from "./icon-button.module.scss";

interface IconButtonProps {
    onClick: () => void;
    svgIcon: ReactElement;
    className?: string;
}

const IconButton: React.FC<IconButtonProps> = props => {
    const { onClick, svgIcon, className, ...buttonProps } = props;
    const classes = merge(className ?? "", css.button);
    return (
        <button type="button" className={classes} onClick={onClick} {...buttonProps}>
            {svgIcon}
        </button>
    );
};

export default React.memo(IconButton);

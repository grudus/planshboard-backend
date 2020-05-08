import React, { ReactElement } from "react";
import { merge } from "utils/cssUtils";
import css from "./icon-button.module.scss";

interface IconButtonProps {
    onClick: () => void;
    svgIcon: ReactElement;
    className?: string;
    reference?: React.Ref<any>;
}

const IconButton: React.FC<IconButtonProps> = props => {
    const { onClick, svgIcon, className, ...buttonProps } = props;
    const classes = merge(className ?? "", css.button);

    const click = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        onClick();
    };
    return (
        <button type="button" className={classes} onClick={click} {...buttonProps} ref={props.reference}>
            <span className={css.iconWrapper}>{svgIcon}</span>
        </button>
    );
};

export default React.memo(IconButton);

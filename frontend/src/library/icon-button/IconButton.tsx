import React, { ReactElement } from "react";
import { merge } from "utils/cssUtils";
import css from "./icon-button.module.scss";

interface IconButtonProps extends React.HTMLProps<HTMLButtonElement> {
    onClick: () => void;
    svgIcon: ReactElement;
    className?: string;
    reference?: React.Ref<any>;
}

const IconButton: React.FC<IconButtonProps> = props => {
    const { onClick, svgIcon, className, ...buttonProps } = props;
    const classes = merge(css.button, className);

    const click = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        onClick();
    };
    return (
        <button className={classes} onClick={click} {...buttonProps} ref={props.reference} type="button">
            <span className={css.iconWrapper}>{svgIcon}</span>
        </button>
    );
};

export default React.memo(IconButton);

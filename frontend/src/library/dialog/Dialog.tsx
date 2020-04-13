import React from "react";
import css from "./dialog.module.scss";
import { merge } from "utils/cssUtils";
import { useAnimatedVisibility } from "utils/hooks/useAnimatedVisibility";

export interface DialogProps {
    open: boolean;
    onCancel: () => void;
    children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = props => {
    const animationTime = parseInt(css.hideAnimationTime, 10);
    const { visible, visibleClass } = useAnimatedVisibility(props.open, animationTime, css.visible);

    if (!visible) {
        return <></>;
    }
    return (
        <div className={merge(css.dialogWrapper, visibleClass)} role="dialog">
            <div className={merge(css.bodyBlocker, visibleClass)} onClick={props.onCancel} />
            <section className={merge(css.dialog, visibleClass)}>{props.children}</section>
        </div>
    );
};

export default React.memo(Dialog);

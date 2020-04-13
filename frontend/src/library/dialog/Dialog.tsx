import React from "react";
import css from "./dialog.module.scss";
import { merge } from "utils/cssUtils";

export interface DialogProps {
    open: boolean;
    onCancel: () => void;
    children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = props => {
    if (!props.open) {
        return <></>;
    }
    return (
        <div className={css.dialogWrapper} role="dialog">
            <div className={merge(css.bodyBlocker)} onClick={props.onCancel} />
            <section className={css.dialog}>{props.children}</section>
        </div>
    );
};

export default React.memo(Dialog);

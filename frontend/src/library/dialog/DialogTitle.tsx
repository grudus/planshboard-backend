import React from "react";
import css from "./dialog.module.scss";
import { merge } from "utils/cssUtils";

const DialogTitle: React.FC<React.HTMLProps<HTMLElement>> = props => (
    <header {...props} className={merge(css.dialogTitle, props.className)}>
        {props.children}
    </header>
);

export default React.memo(DialogTitle);

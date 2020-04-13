import React from "react";
import css from "./dialog.module.scss";
import { merge } from "utils/cssUtils";

const DialogContent: React.FC<React.HTMLProps<HTMLElement>> = props => (
    <main {...props} className={merge(css.dialogContent, props.className)}>
        {props.children}
    </main>
);

export default React.memo(DialogContent);

import React from "react";
import css from "library/dialog/dialog.module.scss";
import { merge } from "utils/cssUtils";

const DialogFooter: React.FC<React.HTMLProps<HTMLElement>> = props => (
    <footer {...props} className={merge(css.dialogFooter, props.className)}>
        {props.children}
    </footer>
);

export default React.memo(DialogFooter);

import React from "react";
import { merge } from "utils/cssUtils";
import css from "library/text/text.module.scss";

type BoldTitleProps = React.HTMLProps<HTMLHeadingElement>;

const BoldTitle: React.FC<BoldTitleProps> = props => (
    <h2 {...props} className={merge(css.boldTitle, props.className)}>
        {props.children}
    </h2>
);

export default BoldTitle;

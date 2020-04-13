import React from "react";
import css from "library/text/text.module.scss";
import { merge } from "utils/cssUtils";

type MediumTitleProps = React.HTMLProps<HTMLHeadingElement>;

const MediumTitle: React.FC<MediumTitleProps> = props => (
    <h2 {...props} className={merge(css.mediumTitle, props.className)}>
        {props.children}
    </h2>
);

export default MediumTitle;

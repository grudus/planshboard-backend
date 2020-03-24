import React from "react";
import css from "./medium-title.module.scss";
import { merge } from "utils/cssUtils";

type MediumTitleProps = React.HTMLProps<HTMLHeadingElement>;

const MediumTitle: React.FC<MediumTitleProps> = props => (
    <h2 {...props} className={merge(css.title, props.className)}>
        {props.children}
    </h2>
);

export default MediumTitle;

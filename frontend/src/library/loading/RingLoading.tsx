import React from "react";
import css from "./ring-loading.module.scss";
import { merge } from "utils/cssUtils";

interface RingLoadingProps {
    className: string;
}

// Source copied from https://loading.io/css/
const RingLoading: React.FC<RingLoadingProps> = props => (
    <div className={merge(css.ring, props.className)}>
        <div />
        <div />
        <div />
        <div />
    </div>
);

export default RingLoading;

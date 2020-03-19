import React, { CSSProperties } from "react";
import css from "./ring-loading.module.scss";
import { merge } from "utils/cssUtils";

interface RingLoadingProps {
    className?: string;
    size?: number;
    borderWidth?: number;
}

// Source copied from https://loading.io/css/
const RingLoading: React.FC<RingLoadingProps> = props => {
    const size = props.size ?? 30;
    const borderWidth = props.borderWidth ?? 3;

    const childDivStyle: CSSProperties = {
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${borderWidth}px`,
        left: `calc(50% - ${size / 2}px)`,
        top: `calc(50% - ${size / 2}px)`,
    };
    return (
        <div className={merge(css.ring, props.className ?? "")}>
            {[0, 1, 2, 3].map(i => (
                <div key={i} style={childDivStyle} />
            ))}
        </div>
    );
};

export default RingLoading;

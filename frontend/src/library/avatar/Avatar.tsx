import React, { ReactElement } from "react";
import css from "./avatar.module.scss";
import { merge } from "utils/cssUtils";

interface AvatarProps {
    image: string | ReactElement;
    name: string;
    size?: number;
    className?: string;
    color?: "primary" | "accent" | "neutral";
}

const Avatar: React.FC<AvatarProps> = props => {
    const size = props.size ?? 48;
    const style = { width: `${size}px`, height: `${size}px` };

    if (typeof props.image === "string") {
        return (
            <img
                className={merge(css.image, props.className, css[props.color ?? "accent"])}
                src={props.image}
                alt={`Avatar ${props.name}`}
                style={style}
            />
        );
    }
    return React.cloneElement(props.image, {
        className: merge(css.image, props.className, css[props.color ?? "accent"]),
        style,
    });
};

export default Avatar;

import React, { ReactElement } from "react";
import css from "./avatar.module.scss";

interface AvatarProps {
    image: string | ReactElement;
    name: string;
}

const Avatar: React.FC<AvatarProps> = props => {
    if (typeof props.image === "string") {
        return <img className={css.image} src={props.image} alt={`Avatar ${props.name}`} />;
    }
    return React.cloneElement(props.image, { className: css.image });
};

export default Avatar;

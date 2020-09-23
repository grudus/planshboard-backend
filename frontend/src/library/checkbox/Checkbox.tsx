import React from "react";
import css from "./checkbox.module.scss";
import { merge } from "utils/cssUtils";

export interface CheckboxProps {
    text: string;
    checked?: boolean;
    color?: "primary" | "accent";
    onCheck?: (value: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = props => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        props.onCheck?.(checked);
    };

    return (
        <label className={merge(css.checkbox, css[props.color || "primary"])}>
            <input type="checkbox" checked={props.checked} onChange={handleInputChange} />
            <span>{props.text}</span>
        </label>
    );
};

export default Checkbox;

import React from "react";
import css from "./checkbox.module.scss";
import { merge } from "utils/cssUtils";
import useTranslations from "app/locale/__hooks/useTranslations";

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

    const { translate } = useTranslations();

    return (
        <label className={merge(css.checkbox, css[props.color || "primary"])}>
            <input type="checkbox" checked={props.checked} onChange={handleInputChange} />
            <span>{translate(props.text)}</span>
        </label>
    );
};

export default Checkbox;

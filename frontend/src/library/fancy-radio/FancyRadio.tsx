import React from "react";
import { cssIf, merge } from "utils/cssUtils";
import css from "./fancy-radio.module.scss";

interface FancyRadioProps {
    text: string;
    icon: React.ReactElement;
    value: any;
    selectedValue?: any;
    inputName: string;
    selectedClassName?: string;
}

const FancyRadio: React.FC<FancyRadioProps> = props => {
    const labelClasses = merge(
        css.button,
        cssIf(merge(css.selected, props.selectedClassName), props.selectedValue === props.value),
        css[props.value],
    );

    return (
        <label className={labelClasses}>
            {props.icon && <div className={css.iconWrapper}>{props.icon}</div>}
            <span className={css.buttonText}>{props.text}</span>
            <input type="radio" className={css.radio} value={props.value} name={props.inputName} />
        </label>
    );
};

export default FancyRadio;

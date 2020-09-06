import React from "react";
import { FinalResult } from "app/plays/__models/PlayModels";
import { cssIf, merge } from "utils/cssUtils";
import css from "./fancy-radio.module.scss";

interface FancyRadioProps {
    text: string;
    icon: React.ReactElement;
    value: FinalResult;
    selectedValue?: FinalResult;
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
            {props.icon}
            <span className={css.buttonText}>{props.text}</span>
            <input type="radio" className={css.radio} value={props.value} name={props.inputName} />
        </label>
    );
};

export default FancyRadio;

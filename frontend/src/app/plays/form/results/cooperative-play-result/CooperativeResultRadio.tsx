import React from "react";
import { cssIf, merge } from "utils/cssUtils";
import css from "app/plays/form/results/cooperative-play-result/cooperative-play-result.module.scss";
import { FinalResult } from "app/plays/__models/PlayModels";

interface CooperativeResultRadioProps {
    text: string;
    icon: React.ReactElement;
    value: FinalResult;
    selectedValue?: FinalResult;
}

const FINAL_RESULT_NAME = "final_result";

const CooperativeResultRadio: React.FC<CooperativeResultRadioProps> = props => (
    <label className={merge(css.button, cssIf(css.selected, props.selectedValue === props.value), css[props.value])}>
        {props.icon}
        <span className={css.buttonText}>{props.text}</span>
        <input type="radio" className={css.radio} value={props.value} name={FINAL_RESULT_NAME} />
    </label>
);

export default React.memo(CooperativeResultRadio);

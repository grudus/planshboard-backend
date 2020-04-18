import React from "react";
import css from "./opponent-radio.module.scss";
import { cssIf, merge } from "utils/cssUtils";
import Avatar from "library/avatar/Avatar";

interface OpponentCheckboxProps {
    title: string;
    secondaryText: string;
    icon: React.ReactElement;
    value: string;
    selectedValue: string;
}

const OPPONENT_TYPE_KEY = "opponentType";

const OpponentRadio: React.FC<OpponentCheckboxProps> = props => (
    <label className={merge(css.radioLabelWrapper, cssIf(css.selected, props.selectedValue === props.value))}>
        <Avatar image={props.icon} name={props.title} />
        <div className={css.textWrapper}>
            <h4 className={css.radioTitle}>{props.title}</h4>
            <span className={css.secondaryText}>{props.secondaryText}</span>
        </div>
        <input type="radio" name={OPPONENT_TYPE_KEY} value={props.value} className={css.radio} />
    </label>
);

export default React.memo(OpponentRadio);

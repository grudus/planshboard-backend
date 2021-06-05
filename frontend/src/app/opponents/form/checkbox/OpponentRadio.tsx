import React from "react";
import css from "./opponent-radio.module.scss";
import { cssIf, merge } from "utils/cssUtils";
import Avatar from "library/avatar/Avatar";
import Heading from "library/text/Heading";
import useTranslations from "app/locale/__hooks/useTranslations";

interface OpponentCheckboxProps {
    title: string;
    secondaryText: string;
    icon: React.ReactElement;
    value: string;
    selectedValue: string;
}

const OPPONENT_TYPE_KEY = "opponentType";

const OpponentRadio: React.FC<OpponentCheckboxProps> = props => {
    const { translate } = useTranslations();

    return (
        <label className={merge(css.radioLabelWrapper, cssIf(css.selected, props.selectedValue === props.value))}>
            <Avatar image={props.icon} name={props.title} />
            <div className={css.textWrapper}>
                <Heading variant="h6" text={props.title} className={css.radioTitle} center />
                <span className={css.secondaryText}>{translate(props.secondaryText)}</span>
            </div>
            <input type="radio" name={OPPONENT_TYPE_KEY} value={props.value} className={css.radio} />
        </label>
    );
};

export default React.memo(OpponentRadio);

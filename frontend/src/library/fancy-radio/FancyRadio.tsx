import React from "react";
import { cssIf, merge } from "utils/cssUtils";
import css from "./fancy-radio.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";

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

    const { translate } = useTranslations();

    return (
        <label className={labelClasses}>
            {props.icon && <div className={css.iconWrapper}>{props.icon}</div>}
            <span className={css.buttonText}>{translate(props.text)}</span>
            <input type="radio" className={css.radio} value={props.value} name={props.inputName} />
        </label>
    );
};

export default React.memo(FancyRadio);

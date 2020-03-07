import React, { ChangeEvent, FunctionComponent, ReactElement, SVGProps, useState } from "react";
import css from "./input.module.scss";
import useTranslations from "app/locale/hooks/useTranslations";

export interface InputProps {
    initialValue?: string;
    onChange?: (a: string) => void;
    placeholderKey?: string;
    autoFocus?: boolean;
    frontIcon?: ReactElement;
    actionIcon?: ReactElement;
    type?: string;
}

const Input: React.FC<InputProps> = props => {
    console.log("@@@@ Input render");
    const { translate } = useTranslations();
    const [text, setText] = useState(props.initialValue || "");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setText(value);
        props?.onChange?.(value);
    };

    return (
        <div className={css.wrapper}>
            {props.frontIcon && React.cloneElement(props.frontIcon, { className: css.frontIcon })}
            {props.actionIcon && React.cloneElement(props.actionIcon, { className: css.actionIcon })}

            <input
                value={text}
                placeholder={translate(props.placeholderKey || "")}
                onChange={handleChange}
                className={css.input}
                autoFocus={props.autoFocus}
                type={props.type || "text"}
            />
        </div>
    );
};

export default React.memo(Input);

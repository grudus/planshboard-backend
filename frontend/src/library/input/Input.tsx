import React, { ChangeEvent, useState } from "react";
import css from "./input.module.scss";
import useTranslations from "app/locale/hooks/useTranslations";

interface InputProps {
    initialValue?: string;
    onChange?: (a: string) => void;
    placeholderKey?: string;
    autoFocus?: boolean;
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
        <input
            value={text}
            placeholder={translate(props.placeholderKey || "")}
            onChange={handleChange}
            className={css.input}
            autoFocus={props.autoFocus}
        />
    );
};

export default React.memo(Input);

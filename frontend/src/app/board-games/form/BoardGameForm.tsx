import React, { FormEvent, useEffect, useState } from "react";
import Input from "library/input/Input";
import Button from "library/button/Button";
import css from "./board-game-form.module.scss";
import MediumTitle from "library/text/MediumTitle";
import useTranslations from "app/locale/hooks/useTranslations";

interface BoardGameFormProps {
    title: string;
    onSubmit: (name: string) => Promise<void>;
    onCancel: () => void;
    error?: string;
    initialValue?: string;
}

const BoardGameForm: React.FC<BoardGameFormProps> = props => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { translate } = useTranslations();

    useEffect(() => {
        !!props.error && setLoading(false);
    }, [props.error]);

    useEffect(() => {
        setName(props.initialValue ?? "");
    }, [props.initialValue]);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await props.onSubmit(name);
    };

    return (
        <form onSubmit={submitForm} className={css.form}>
            <MediumTitle className={css.title}>{props.title}</MediumTitle>
            <Input
                label={translate("BOARD_GAMES.FORM.INPUT")}
                name="name"
                onTextChange={setName}
                autoFocus
                error={props.error}
                initialValue={props.initialValue}
            />
            <div className={css.buttonsWrapper}>
                <Button
                    text={translate("BOARD_GAMES.FORM.CANCEL")}
                    color="accent"
                    decoration="outlined"
                    onClick={props.onCancel}
                />
                <Button
                    text={translate("BOARD_GAMES.FORM.SAVE")}
                    color="primary"
                    type="submit"
                    disabled={!name}
                    loading={loading}
                />
            </div>
        </form>
    );
};

export default React.memo(BoardGameForm);

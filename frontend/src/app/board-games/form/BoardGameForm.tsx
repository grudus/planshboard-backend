import React, { FormEvent, useEffect, useState } from "react";
import Input from "library/input/Input";
import Button from "library/button/Button";
import css from "./board-game-form.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";
import BoardGameOptions from "app/board-games/form/board-game-options/BoardGameOptions";
import { defaultRegularGameOptions } from "app/board-games/__models/BoardGameModels";
import { AddBoardGameRequest, EditBoardGameRequest } from "app/board-games/BoardGameApi";

interface BoardGameFormProps {
    onSubmit: (request: AddBoardGameRequest | EditBoardGameRequest) => Promise<void>;
    onCancel: () => void;
    error?: string;
    initialValue?: string;
}

const BoardGameForm: React.FC<BoardGameFormProps> = props => {
    const [name, setName] = useState("");
    const [options, setOptions] = useState(defaultRegularGameOptions);
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
        await props.onSubmit({ name, ...options });
    };

    return (
        <form onSubmit={submitForm} className={css.form}>
            <Input
                label={translate("BOARD_GAMES.FORM.INPUT")}
                name="name"
                onTextChange={setName}
                autoFocus
                error={props.error}
                initialValue={props.initialValue}
            />

            <BoardGameOptions options={options} onChangeOptions={setOptions} />

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

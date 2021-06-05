import React, { FormEvent, useEffect, useState } from "react";
import Input from "library/input/Input";
import Button from "library/button/Button";
import css from "./board-game-form.module.scss";
import BoardGameOptions from "app/board-games/form/board-game-options/BoardGameOptions";
import { defaultRegularGameOptions, SingleBoardGame } from "app/board-games/__models/BoardGameModels";
import { AddBoardGameRequest, EditBoardGameRequest } from "app/board-games/__models/BoardGameApiModels";

interface BoardGameFormProps {
    onSubmit: (request: AddBoardGameRequest | EditBoardGameRequest) => Promise<void>;
    onCancel: () => void;
    error?: string;
    initialValue?: SingleBoardGame;
}

const BoardGameForm: React.FC<BoardGameFormProps> = props => {
    const [name, setName] = useState(props.initialValue?.boardGame.name ?? "");
    const [options, setOptions] = useState(props.initialValue?.options ?? defaultRegularGameOptions);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        !!props.error && setLoading(false);
    }, [props.error]);

    useEffect(() => {
        setName(props.initialValue?.boardGame.name ?? "");
        setOptions(props.initialValue?.options ?? defaultRegularGameOptions);
    }, [props.initialValue]);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await props.onSubmit({ name, options });
    };

    return (
        <form onSubmit={submitForm} className={css.form}>
            <Input
                label="BOARD_GAMES.FORM.INPUT"
                name="name"
                onTextChange={setName}
                autoFocus
                error={props.error}
                initialValue={props.initialValue?.boardGame.name}
            />

            <BoardGameOptions options={options} onChangeOptions={setOptions} />

            <div className={css.buttonsWrapper}>
                <Button text="BOARD_GAMES.FORM.CANCEL" color="accent" decoration="outlined" onClick={props.onCancel} />
                <Button text="BOARD_GAMES.FORM.SAVE" color="primary" type="submit" disabled={!name} loading={loading} />
            </div>
        </form>
    );
};

export default React.memo(BoardGameForm);

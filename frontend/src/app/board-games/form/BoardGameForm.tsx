import React, { FormEvent } from "react";
import Input from "library/input/Input";
import Button from "library/button/Button";
import css from "./board-game-form.module.scss";

interface BoardGameFormProps {
    title: string;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

const BoardGameForm: React.FC<BoardGameFormProps> = props => {
    let name = ""; // Disable re-render on input change

    const submitForm = (e: FormEvent) => {
        e.preventDefault();
        props.onSubmit(name);
    };

    return (
        <form onSubmit={submitForm} className={css.form}>
            <h2 className={css.title}>{props.title}</h2>
            <Input label="Podaj nazwę" name="name" onTextChange={text => (name = text)} />
            <div className={css.buttonsWrapper}>
                <Button text="Cofnij" color="accent" decoration="outlined" onClick={props.onCancel} />
                <Button text="Zapisz" color="primary" type="submit" />
            </div>
        </form>
    );
};

export default React.memo(BoardGameForm);

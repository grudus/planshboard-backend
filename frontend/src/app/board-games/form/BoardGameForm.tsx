import React, { FormEvent, useState } from "react";
import Input from "library/input/Input";
import Button from "library/button/Button";
import css from "./board-game-form.module.scss";

interface BoardGameFormProps {
    title: string;
    onSubmit: (name: string) => Promise<void>;
    onCancel: () => void;
}

const BoardGameForm: React.FC<BoardGameFormProps> = props => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await props.onSubmit(name);
    };

    return (
        <form onSubmit={submitForm} className={css.form}>
            <h2 className={css.title}>{props.title}</h2>
            <Input label="Podaj nazwę" name="name" onTextChange={setName} autoFocus />
            <div className={css.buttonsWrapper}>
                <Button text="Cofnij" color="accent" decoration="outlined" onClick={props.onCancel} />
                <Button text="Zapisz" color="primary" type="submit" disabled={!name} loading={loading} />
            </div>
        </form>
    );
};

export default React.memo(BoardGameForm);

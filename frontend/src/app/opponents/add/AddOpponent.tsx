import React from "react";
import OpponentForm from "app/opponents/form/OpponentForm";
import css from "./add-opponent.module.scss";
import { CreateOpponentRequest } from "app/opponents/__models/OpponentModels";

const AddOpponent: React.FC = () => {
    const onSubmit = async (request: CreateOpponentRequest) => {
        alert(JSON.stringify(request));
    };

    return (
        <section className={css.formWrapper}>
            <h1 className={css.header}>Dodaj przeciwnika</h1>
            <OpponentForm onSubmit={onSubmit} />
        </section>
    );
};

export default AddOpponent;

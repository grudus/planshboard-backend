import React from "react";
import OpponentForm from "app/opponents/form/OpponentForm";
import { CreateOpponentRequest } from "app/opponents/__models/OpponentModels";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import css from "./add-opponent.module.scss";

const AddOpponent: React.FC = () => {
    const onSubmit = async (request: CreateOpponentRequest) => {
        alert(JSON.stringify(request));
    };

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>Dodaj przeciwnika</CardFormTitle>
            <CardFormContent>
                <OpponentForm onSubmit={onSubmit} />
            </CardFormContent>
        </CardForm>
    );
};

export default AddOpponent;

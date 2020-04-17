import React from "react";
import OpponentForm from "app/opponents/form/OpponentForm";
import { CreateOpponentRequest } from "app/opponents/__models/OpponentModels";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import css from "./add-opponent.module.scss";
import { useHistory } from "react-router-dom";
import { appRoutes } from "app/routing/routes";

const AddOpponent: React.FC = () => {
    const history = useHistory();
    const onSubmit = async (request: CreateOpponentRequest) => {
        alert(JSON.stringify(request));
        onCancel();
    };

    const onCancel = () => {
        history.push(appRoutes.opponents.list);
    };

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>Dodaj przeciwnika</CardFormTitle>
            <CardFormContent>
                <OpponentForm onSubmit={onSubmit} onCancel={onCancel} />
            </CardFormContent>
        </CardForm>
    );
};

export default AddOpponent;

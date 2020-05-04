import React from "react";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import PlayForm from "app/plays/form/PlayForm";
import css from "./add-play.module.scss";
import { Opponent } from "app/opponents/__models/OpponentModels";

const AddPlay: React.FC = () => {
    const selectedOpponents: Opponent[] = [
        { id: 1, name: "grudus", linkedUser: { status: "LINKED_WITH_CREATOR", userId: 1, userName: "grudus" } },
    ];

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>Dodaj rozgrywkę</CardFormTitle>
            <CardFormContent>
                <PlayForm selectedOpponents={selectedOpponents} />
            </CardFormContent>
        </CardForm>
    );
};

export default AddPlay;

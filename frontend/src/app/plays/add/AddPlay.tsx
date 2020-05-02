import React from "react";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import PlayForm from "app/plays/form/PlayForm";
import css from "./add-play.module.scss";
import { Opponent } from "app/opponents/__models/OpponentModels";

const AddPlay: React.FC = () => {
    const possibleOpponents: Opponent[] = [
        { id: 1, name: "grudus", linkedUser: { status: "LINKED_WITH_CREATOR", userId: 1, userName: "grudus" } },
        { id: 2, name: "madzia", linkedUser: { status: "ENABLED", userId: 2, userName: "maddie" } },
        { id: 3, name: "kamrat" },
        { id: 4, name: "bolec" },
        { id: 5, name: "ramzes" },
        { id: 6, name: "długie imie po co w ogóle takie wymyślać dla kogoś" },
    ];
    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>Dodaj rozgrywkę</CardFormTitle>
            <CardFormContent>
                <PlayForm possibleOpponents={possibleOpponents} />
            </CardFormContent>
        </CardForm>
    );
};

export default AddPlay;

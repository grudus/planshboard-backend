import React from "react";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import PlayForm from "app/plays/form/PlayForm";
import css from "./add-play.module.scss";
import { Opponent } from "app/opponents/__models/OpponentModels";
import { useRedux } from "store/rootReducer";

const AddPlay: React.FC = () => {
    const currentUser = useRedux(s => s.opponent.currentUser);
    const selectedOpponents: Opponent[] = currentUser ? [currentUser] : [];

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>Dodaj rozgrywkę</CardFormTitle>
            <CardFormContent>
                <PlayForm results={selectedOpponents.map(o => ({ opponent: o }))} />
            </CardFormContent>
        </CardForm>
    );
};

export default AddPlay;

import React from "react";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import PlayForm from "app/plays/form/PlayForm";
import css from "./add-play.module.scss";
import { Opponent } from "app/opponents/__models/OpponentModels";
import { useRedux } from "store/rootReducer";
import { PlayMeta, PlayResultRow } from "app/plays/__models/PlayModels";

const AddPlay: React.FC = () => {
    const currentUser = useRedux(s => s.opponent.currentUser);
    const selectedOpponents: Opponent[] = currentUser ? [currentUser] : [];

    const onSubmit = async (results: PlayResultRow[], meta: PlayMeta) => {
        console.log("@@@ On submit form", results, meta);
    };

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>Dodaj rozgrywkę</CardFormTitle>
            <CardFormContent>
                <PlayForm
                    results={selectedOpponents.map(o => ({ opponent: o }))}
                    onSubmit={onSubmit}
                    onCancel={() => onSubmit([], {})}
                />
            </CardFormContent>
        </CardForm>
    );
};

export default AddPlay;

import React, { useEffect } from "react";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import PlayForm from "app/plays/form/PlayForm";
import css from "./add-play.module.scss";
import { Opponent } from "app/opponents/__models/OpponentModels";
import { useRedux } from "store/rootReducer";
import { PlayMeta, PlayResultRow, SavePlayRequest } from "app/plays/__models/PlayModels";
import useTranslations from "app/locale/__hooks/useTranslations";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { createPlayRequest, getTagsRequest } from "app/plays/PlayApi";
import { getAllOpponentsRequest } from "app/opponents/OpponentApi";

const AddPlay: React.FC = () => {
    const { translate } = useTranslations();
    const dispatch = useHttpDispatch();
    const currentUser = useRedux(s => s.opponent.currentUser);
    const selectedOpponents: Opponent[] = currentUser ? [currentUser] : [];

    useEffect(() => {
        getTagsRequest(dispatch);
        getAllOpponentsRequest(dispatch);
    }, [dispatch]);

    const onSubmit = async (results: PlayResultRow[], meta: PlayMeta) => {
        const request: SavePlayRequest = {
            boardGameId: 1,
            results: results.map(r => ({ ...r, opponentId: r.opponent.id })),
            tags: meta.tags ?? [],
            ...meta,
        };
        await createPlayRequest(dispatch, request);
    };

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>{translate("PLAYS.ADD.TITLE")}</CardFormTitle>
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

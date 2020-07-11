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
import { getAllOpponentsRequest, getFrequentOpponentsRequest } from "app/opponents/OpponentApi";
import { useQueryParams } from "app/shared/hooks/useQueryParams";
import { getSingleBoardGame } from "app/board-games/BoardGameApi";
import Chip from "library/chip/Chip";

const AddPlay: React.FC = () => {
    const { translate } = useTranslations();
    const dispatch = useHttpDispatch();
    const { boardGameId } = useQueryParams();
    const boardGame = useRedux(state => state.boardGame.single);
    const currentUser = useRedux(s => s.opponent.currentUser);
    const selectedOpponents: Opponent[] = currentUser ? [currentUser] : [];

    useEffect(() => {
        getTagsRequest(dispatch);
        getAllOpponentsRequest(dispatch);
        getFrequentOpponentsRequest(dispatch);
        getSingleBoardGame(dispatch, { id: parseInt(boardGameId, 10) });
    }, [boardGameId, dispatch]);

    const onSubmit = async (results: PlayResultRow[], meta: PlayMeta) => {
        const request: SavePlayRequest = {
            boardGameId: parseInt(boardGameId, 10),
            results: results.map(r => ({ ...r, opponentId: r.opponent.id })),
            tags: meta.tags ?? [],
            ...meta,
        };
        await createPlayRequest(dispatch, request);
    };

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>
                <div className={css.headerWrapper}>
                    <h1>{translate("PLAYS.ADD.TITLE")}</h1>
                    {boardGame && <Chip text={boardGame.name} className={css.headerBoardGame} onClick={() => true} />}
                </div>
            </CardFormTitle>
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

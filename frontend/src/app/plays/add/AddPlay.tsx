import React, { useCallback, useEffect, useState } from "react";
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
import Chip from "library/chip/Chip";
import { appRoutes } from "app/routing/routes";
import SelectBoardGameDialog from "app/plays/select-board-game-dialog/SelectBoardGameDialog";
import useDialog from "library/dialog/context/useDialog";
import { useDispatch } from "react-redux";
import { BoardGameActions } from "app/board-games/__store/boardGameActions";

const AddPlay: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const currentGame = useRedux(state => state.boardGame.single);
    const currentUser = useRedux(s => s.opponent.currentUser);

    const { boardGameId, history } = useQueryParams();
    const { translate } = useTranslations();
    const httpDispatch = useHttpDispatch();
    const dispatch = useDispatch();
    const selectedOpponents: Opponent[] = currentUser ? [currentUser] : [];
    const { showDialog } = useDialog();

    const selectBoardGame = useCallback(
        (id: number) =>
            history.push({
                pathname: appRoutes.plays.add,
                search: id ? `?boardGameId=${id}` : "",
            }),
        [history],
    );

    const showBoardGameDialog = useCallback(() => {
        showDialog(<SelectBoardGameDialog onSelect={selectBoardGame} />);
    }, [showDialog, selectBoardGame]);

    useEffect(() => {
        if (!boardGameId) {
            showBoardGameDialog();
            return;
        }
        getTagsRequest(httpDispatch);
        getAllOpponentsRequest(httpDispatch);
        getFrequentOpponentsRequest(httpDispatch);
        dispatch(BoardGameActions.getSingleBoardGame({ id: parseInt(boardGameId, 10) }));
    }, [boardGameId, httpDispatch, showBoardGameDialog, dispatch]);

    const onSubmit = async (results: PlayResultRow[], meta: PlayMeta) => {
        setLoading(true);
        const request: SavePlayRequest = {
            boardGameId: parseInt(boardGameId, 10),
            results: results.map(r => ({ ...r, opponentId: r.opponent.id })),
            tags: meta.tags ?? [],
            ...meta,
        };
        await createPlayRequest(httpDispatch, request);
        setLoading(false);
        goBack();
    };

    const goBack = () => {
        history.push(appRoutes.plays.list);
    };

    return (
        <>
            <CardForm className={css.formWrapper}>
                <CardFormTitle>
                    <div className={css.headerWrapper}>
                        <h1>{translate("PLAYS.ADD.TITLE")}</h1>
                        {currentGame && (
                            <Chip
                                text={currentGame.boardGame.name}
                                className={css.headerBoardGame}
                                onClick={showBoardGameDialog}
                            />
                        )}
                    </div>
                </CardFormTitle>
                <CardFormContent>
                    <PlayForm
                        results={selectedOpponents.map(o => ({ opponent: o }))}
                        onSubmit={onSubmit}
                        onCancel={goBack}
                        loading={loading}
                    />
                </CardFormContent>
            </CardForm>
        </>
    );
};

export default AddPlay;

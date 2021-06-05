import React, { useCallback, useEffect, useState } from "react";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import PlayForm from "app/plays/form/PlayForm";
import css from "./add-play.module.scss";
import { Opponent } from "app/opponents/__models/OpponentModels";
import { useRedux } from "store/rootReducer";
import { PlayMeta, PlayResultRow, SavePlayRequest } from "app/plays/__models/PlayModels";
import { useQueryParams } from "app/shared/hooks/useQueryParams";
import Chip from "library/chip/Chip";
import { appRoutes } from "app/routing/routes";
import SelectBoardGameDialog from "app/plays/select-board-game-dialog/SelectBoardGameDialog";
import useDialog from "library/dialog/context/useDialog";
import { useDispatch } from "react-redux";
import { BoardGameActions } from "app/board-games/__store/boardGameActions";
import OpponentActions from "app/opponents/__store/opponentActions";
import PlayActions from "app/plays/__store/playActions";
import Heading from "library/text/Heading";

const AddPlay: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const currentGame = useRedux(state => state.boardGame.single);
    const currentUser = useRedux(s => s.opponent.currentUser);

    const { boardGameId, history } = useQueryParams();
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
        dispatch(PlayActions.getTags());
        dispatch(OpponentActions.getAllOpponents());
        dispatch(OpponentActions.getFrequentOpponents());
        dispatch(BoardGameActions.getSingleBoardGame({ id: parseInt(boardGameId, 10) }));
    }, [boardGameId, showBoardGameDialog, dispatch]);

    const onSubmit = async (results: PlayResultRow[], meta: PlayMeta) => {
        setLoading(true);
        const request: SavePlayRequest = {
            boardGameId: parseInt(boardGameId, 10),
            results: results.map(r => ({ ...r, opponentId: r.opponent.id })),
            tags: meta.tags ?? [],
            ...meta,
        };
        await dispatch(PlayActions.savePlay(request));
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
                        <Heading text="PLAYS.ADD.TITLE" variant="h4" />
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

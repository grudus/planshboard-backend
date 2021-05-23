import React, { useEffect, useState } from "react";
import BoardGameForm from "app/board-games/form/BoardGameForm";
import { useHistory, useParams } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import useTranslations from "app/locale/__hooks/useTranslations";
import { useRedux } from "store/rootReducer";
import { getErrorCode } from "utils/httpUtils";
import CardForm from "library/card-form/CardForm";
import CardFormContent from "library/card-form/CardFormContent";
import CardFormTitle from "library/card-form/CardFormTitle";
import css from "./edit-board-game.module.scss";
import { BoardGameActions } from "app/board-games/__store/boardGameActions";
import { useAppDispatch } from "store/useAppDispatch";
import { AddBoardGameRequest, EditBoardGameRequest } from "app/board-games/__models/BoardGameApiModels";

const EditBoardGame: React.FC = () => {
    const history = useHistory();
    const currentGame = useRedux(state => state.boardGame.single);
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { translate } = useTranslations();
    const [error, setError] = useState("");

    useEffect(() => {
        dispatch(BoardGameActions.getSingleBoardGame({ id: +id! }));
    }, [dispatch, id]);

    const onSubmit = async (request: AddBoardGameRequest | EditBoardGameRequest) => {
        try {
            setError("");
            await dispatch(BoardGameActions.editBoardGame({ ...request, id: +id! }));
            onCancel();
        } catch (e) {
            const code = getErrorCode(e);
            setError(translate(`ERRORS.${code}`));
        }
    };
    const onCancel = () => {
        history.push(appRoutes.boardGame.list);
    };

    if (!currentGame) return <></>;

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>
                <h1>{translate("BOARD_GAMES.EDIT.TITLE") + ` '${currentGame?.boardGame.name}'`}</h1>
            </CardFormTitle>
            <CardFormContent>
                <BoardGameForm onSubmit={onSubmit} onCancel={onCancel} error={error} initialValue={currentGame} />
            </CardFormContent>
        </CardForm>
    );
};

export default EditBoardGame;

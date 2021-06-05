import React, { useState } from "react";
import BoardGameForm from "app/board-games/form/BoardGameForm";
import { useHistory } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import { getErrorCode } from "utils/httpUtils";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import css from "./add-board-game.module.scss";
import { useDispatch } from "react-redux";
import { BoardGameActions } from "app/board-games/__store/boardGameActions";
import { AddBoardGameRequest } from "app/board-games/__models/BoardGameApiModels";
import Heading from "library/text/Heading";

const AddBoardGame: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const onSubmit = async (request: AddBoardGameRequest) => {
        try {
            setError("");
            await dispatch(BoardGameActions.addBoardGame(request));
            onCancel();
        } catch (e) {
            const code = getErrorCode(e);
            setError(`ERRORS.${code}`);
        }
    };
    const onCancel = () => {
        history.push(appRoutes.boardGame.list);
    };
    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>
                <Heading variant="h4" text="BOARD_GAMES.ADD.TITLE" />
            </CardFormTitle>
            <CardFormContent>
                <BoardGameForm onSubmit={onSubmit} onCancel={onCancel} error={error} />
            </CardFormContent>
        </CardForm>
    );
};

export default AddBoardGame;

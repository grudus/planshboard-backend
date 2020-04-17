import React, { useEffect, useState } from "react";
import BoardGameForm from "app/board-games/form/BoardGameForm";
import { useHistory, useParams } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import useTranslations from "app/locale/__hooks/useTranslations";
import { editBoardGameRequest, getSingleBoardGame } from "app/board-games/BoardGameApi";
import { useRedux } from "store/rootReducer";
import { getErrorCode } from "utils/httpUtils";
import CardForm from "library/card-form/CardForm";
import CardFormContent from "library/card-form/CardFormContent";
import CardFormTitle from "library/card-form/CardFormTitle";
import css from "./edit-board-game.module.scss";

const EditBoardGame: React.FC = () => {
    const history = useHistory();
    const boardGame = useRedux(state => state.boardGame.single);
    const { id } = useParams();
    const dispatch = useHttpDispatch();
    const { translate } = useTranslations();
    const [error, setError] = useState("");

    useEffect(() => {
        getSingleBoardGame(dispatch, { id: +id!! });
    }, [dispatch, id]);

    const onSubmit = async (name: string) => {
        try {
            setError("");
            if (name !== boardGame?.name) {
                await editBoardGameRequest(dispatch, { name, id: +id!! });
            }
            onCancel();
        } catch (e) {
            const code = getErrorCode(e);
            setError(translate(`ERRORS.${code}`));
        }
    };
    const onCancel = () => {
        history.push(appRoutes.boardGame.list);
    };

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>{translate("BOARD_GAMES.EDIT.TITLE") + ` '${boardGame?.name}'`}</CardFormTitle>
            <CardFormContent>
                <BoardGameForm onSubmit={onSubmit} onCancel={onCancel} error={error} initialValue={boardGame?.name} />
            </CardFormContent>
        </CardForm>
    );
};

export default EditBoardGame;

import React, { useState } from "react";
import BoardGameForm from "app/board-games/form/BoardGameForm";
import { useHistory } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { addBoardGameRequest } from "app/board-games/BoardGameApi";
import useTranslations from "app/locale/__hooks/useTranslations";
import { getErrorCode } from "utils/httpUtils";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import css from "./add-board-game.module.scss";

const AddBoardGame: React.FC = () => {
    const history = useHistory();
    const dispatch = useHttpDispatch();
    const { translate } = useTranslations();
    const [error, setError] = useState("");

    const onSubmit = async (name: string) => {
        try {
            setError("");
            await addBoardGameRequest(dispatch, { name });
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
            <CardFormTitle>
                <h1>{translate("BOARD_GAMES.ADD.TITLE")}</h1>
            </CardFormTitle>
            <CardFormContent>
                <BoardGameForm onSubmit={onSubmit} onCancel={onCancel} error={error} />
            </CardFormContent>
        </CardForm>
    );
};

export default AddBoardGame;

import React, { useState } from "react";
import OpponentForm from "app/opponents/form/OpponentForm";
import { SaveOpponentRequest } from "app/opponents/__models/OpponentModels";
import CardForm from "library/card-form/CardForm";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import css from "./add-opponent.module.scss";
import { useHistory } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import useTranslations from "app/locale/__hooks/useTranslations";
import { useAppDispatch } from "store/useAppDispatch";
import OpponentActions from "app/opponents/__store/opponentActions";

const AddOpponent: React.FC = () => {
    const history = useHistory();
    const { translate } = useTranslations();
    const dispatch = useAppDispatch();
    const [opponentNameError, setOpponentNameError] = useState("");
    const [existingUserNameError, setExistingUserNameError] = useState("");

    const onSubmit = async (request: SaveOpponentRequest) => {
        try {
            setExistingUserNameError("");
            setOpponentNameError("");
            dispatch(OpponentActions.createOpponent(request));
            onCancel();
        } catch (e) {
            const code = JSON.parse(e).code;
            const errorText = translate(`OPPONENTS.ADD.ERRORS.${code}`);
            const inputWithError = code === "OPPONENT_ALREADY_EXISTS" ? setOpponentNameError : setExistingUserNameError;
            inputWithError(errorText);
        }
    };

    const onCancel = () => {
        history.push(appRoutes.opponents.list);
    };

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>
                <h1>{translate("OPPONENTS.ADD.TITLE")}</h1>
            </CardFormTitle>
            <CardFormContent>
                <OpponentForm
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    opponentNameError={opponentNameError}
                    existingUserNameError={existingUserNameError}
                />
            </CardFormContent>
        </CardForm>
    );
};

export default AddOpponent;

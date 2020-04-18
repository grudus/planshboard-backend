import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { getSingleOpponent } from "app/opponents/OpponentApi";
import CardForm from "library/card-form/CardForm";
import css from "app/opponents/add/add-opponent.module.scss";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import OpponentForm from "app/opponents/form/OpponentForm";
import { CreateOpponentRequest } from "app/opponents/__models/OpponentModels";
import { appRoutes } from "app/routing/routes";
import { useRedux } from "store/rootReducer";
import useTranslations from "app/locale/__hooks/useTranslations";

const EditOpponent: React.FC = () => {
    const { id } = useParams();
    const history = useHistory();
    const { translate } = useTranslations();
    const dispatch = useHttpDispatch();
    const opponent = useRedux(state => state.opponent.single);

    useEffect(() => {
        getSingleOpponent(dispatch, { id: +id!! });
    }, [dispatch, id]);

    const onSubmit = async (request: CreateOpponentRequest) => {
        alert(JSON.stringify(request));
        onCancel();
    };
    const onCancel = () => {
        history.push(appRoutes.opponents.list);
    };

    return (
        <CardForm className={css.formWrapper}>
            <CardFormTitle>
                {translate("OPPONENTS.EDIT.TITLE")} <span className={css.opponentName}>{opponent?.name}</span>
            </CardFormTitle>
            <CardFormContent>
                <OpponentForm onSubmit={onSubmit} onCancel={onCancel} initialValue={opponent} />
            </CardFormContent>
        </CardForm>
    );
};

export default EditOpponent;

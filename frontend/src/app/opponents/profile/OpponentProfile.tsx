import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { getSingleOpponent } from "app/opponents/OpponentApi";
import CardForm from "library/card-form/CardForm";
import css from "app/opponents/profile/opponent-profile.module.scss";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import OpponentForm from "app/opponents/form/OpponentForm";
import { CreateOpponentRequest } from "app/opponents/__models/OpponentModels";
import { appRoutes } from "app/routing/routes";
import { useRedux } from "store/rootReducer";
import useTranslations from "app/locale/__hooks/useTranslations";
import OpponentProfileStats from "app/opponents/profile/stats/OpponentProfileStats";

const OpponentProfile: React.FC = () => {
    const { id } = useParams();
    const history = useHistory();
    const { translate } = useTranslations();
    const dispatch = useHttpDispatch();
    const { opponent, stats } = useRedux(state => state.opponent.single) ?? {};

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
        <CardForm className={css.cardWrapper}>
            <CardFormTitle>
                {translate("OPPONENTS.PROFILE.TITLE")} <span className={css.opponentName}>{opponent?.name}</span>
            </CardFormTitle>
            <div className={css.contentWrapper}>
                <CardFormContent className={css.formWrapper}>
                    <OpponentForm onSubmit={onSubmit} onCancel={onCancel} initialValue={opponent} />
                </CardFormContent>
                <div className={css.divider} />
                <OpponentProfileStats stats={stats} />
            </div>
        </CardForm>
    );
};

export default OpponentProfile;

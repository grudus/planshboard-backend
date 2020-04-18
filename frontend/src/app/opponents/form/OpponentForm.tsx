import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Input from "library/input/Input";
import css from "./opponent-form.module.scss";
import Icons from "library/icons/Icons";
import OpponentRadio from "app/opponents/form/checkbox/OpponentRadio";
import useTranslations from "app/locale/__hooks/useTranslations";
import { cssIf, merge } from "utils/cssUtils";
import Button from "library/button/Button";
import { CreateOpponentRequest, SingleOpponentStats } from "app/opponents/__models/OpponentModels";

const NEW_OPPONENT_VALUE = "new";
const EXISTING_OPPONENT_VALUE = "existing";

interface OpponentFormProps {
    onSubmit: (request: CreateOpponentRequest) => Promise<void>;
    onCancel: () => void;
    initialValue?: SingleOpponentStats;
}

const OpponentForm: React.FC<OpponentFormProps> = props => {
    const [opponentName, setOpponentName] = useState("");
    const [existingUserName, setExistingUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const [opponentType, setOpponentType] = useState(NEW_OPPONENT_VALUE);
    const { translate } = useTranslations();

    useEffect(() => {
        setOpponentName(props.initialValue?.name ?? "");
        setExistingUserName(props.initialValue?.existingUserName ?? "");
        setOpponentType(props.initialValue?.existingUserName ? EXISTING_OPPONENT_VALUE : NEW_OPPONENT_VALUE);
    }, [props.initialValue]);

    const onSubmit = async (e: FormEvent) => {
        setLoading(true);
        e.preventDefault();
        await props.onSubmit({ opponentName, existingUserName });
    };

    const isFormValid = () => {
        return !!opponentName && (shouldDisplayUserInput ? !!existingUserName : true);
    };

    const change = (a: ChangeEvent<HTMLInputElement>) => {
        const { value } = a.target;
        setOpponentType(value);
    };

    const shouldDisplayUserInput = opponentType === EXISTING_OPPONENT_VALUE;

    return (
        <form onSubmit={onSubmit}>
            <Input
                label={translate("OPPONENTS.FORM.NAME_LABEL")}
                name="name"
                onTextChange={setOpponentName}
                autoFocus
                initialValue={props.initialValue?.name}
            />

            <div className={css.radioGroup} onChange={change}>
                <OpponentRadio
                    icon={Icons.NewUser}
                    title={translate("OPPONENTS.FORM.NEW_OPPONENT_VALUE")}
                    value={NEW_OPPONENT_VALUE}
                    selectedValue={opponentType}
                />
                <OpponentRadio
                    icon={Icons.ExistingUser}
                    title={translate("OPPONENTS.FORM.EXISTING_USER_VALUE")}
                    value={EXISTING_OPPONENT_VALUE}
                    selectedValue={opponentType}
                />
            </div>

            <div className={merge(css.existingUserWrapper, cssIf(css.visible, shouldDisplayUserInput))}>
                <p className={css.existingUserExplanation}>{translate("OPPONENTS.FORM.EXISTING_USER_EXPLANATION")}</p>
                <Input
                    label={translate("OPPONENTS.FORM.EXISTING_USER_LABEL")}
                    name="existing-user"
                    onTextChange={setExistingUserName}
                    initialValue={props.initialValue?.existingUserName}
                />
            </div>

            <div className={merge(css.buttons)}>
                <Button text={translate("CANCEL")} decoration="outlined" color="accent" onClick={props.onCancel} />
                <Button text={translate("SAVE")} type="submit" disabled={!isFormValid()} loading={loading} />
            </div>
        </form>
    );
};

export default OpponentForm;

import React, { ChangeEvent, FormEvent, useState } from "react";
import Input from "library/input/Input";
import css from "./opponent-form.module.scss";
import Icons from "library/icons/Icons";
import OpponentRadio from "app/opponents/form/checkbox/OpponentRadio";
import useTranslations from "app/locale/__hooks/useTranslations";

const NEW_OPPONENT_VALUE = "new";
const EXISTING_OPPONENT_VALUE = "existing";

const OpponentForm: React.FC = () => {
    const [opponentName, setOpponentName] = useState("");
    const [opponentType, setOpponentType] = useState(NEW_OPPONENT_VALUE);
    const { translate } = useTranslations();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        alert("Submit " + opponentName);
    };

    const change = (a: ChangeEvent<HTMLInputElement>) => {
        const { value } = a.target;
        setOpponentType(value);
    };

    return (
        <form onSubmit={onSubmit}>
            <Input label={translate("OPPONENTS.FORM.NAME_LABEL")} name="name" onTextChange={setOpponentName} />

            <div className={css.radioGroup} onChange={change}>
                <OpponentRadio
                    icon={Icons.NewUser}
                    title={translate("OPPONENTS.FORM.NEW_OPPONENT_VALUE")}
                    value={NEW_OPPONENT_VALUE}
                    selectedValue={opponentType}
                />
                <OpponentRadio
                    icon={Icons.ExistingUser}
                    title={translate("OPPONENTS.FORM.EXISTING_OPPONENT_VALUE")}
                    value={EXISTING_OPPONENT_VALUE}
                    selectedValue={opponentType}
                />
            </div>
        </form>
    );
};

export default OpponentForm;

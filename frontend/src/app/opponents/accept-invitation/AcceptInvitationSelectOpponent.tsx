import React, { useState } from "react";
import FancyRadio from "library/fancy-radio/FancyRadio";
import Input from "library/input/Input";
import OpponentsDropdown from "app/opponents/dropdown/OpponentsDropdown";
import css from "./accept-invitation.module.scss";
import Icons from "library/icons/Icons";
import { SelectedOpponent } from "app/opponents/accept-invitation/AcceptInvitationDialog";
import useTranslations from "app/locale/__hooks/useTranslations";
import Heading from "library/text/Heading";

interface AcceptInvitationSelectOpponentProps {
    onChange: (opponent: SelectedOpponent | null) => void;
    creatorDisplayName: string;
    error?: string;
}

const AcceptInvitationSelectOpponent: React.FC<AcceptInvitationSelectOpponentProps> = props => {
    const [useExistingOpponent, setUseExistingOpponent] = useState(true);
    const { translate } = useTranslations();

    const toggleExistingOpponent = () => {
        setUseExistingOpponent(!useExistingOpponent);
        props.onChange(null);
    };

    const FormComponent = useExistingOpponent ? (
        <OpponentsDropdown
            selectTextKey={translate("PLAYS.FORM.OPPONENTS.DROPDOWN_LABEL")}
            opponentFilter={op => !op.linkedUser}
            creationForbidden
            onSelect={({ id }) => props.onChange({ existingOpponentId: id })}
        />
    ) : (
        <Input
            name="newUserName"
            label={translate("OPPONENTS.FORM.NAME_LABEL")}
            onTextChange={text => props.onChange({ newOpponentName: text })}
            error={props.error}
        />
    );

    return (
        <div className={css.selectOpponents}>
            <Heading variant="h4" className={css.mainText} text="NOTIFICATIONS.ACCEPT_LINKED.LINK_TITLE" />
            <p className={css.subText}>
                {translate("NOTIFICATIONS.ACCEPT_LINKED.LINK_DESCRIPTION").replace(
                    "{{name}}",
                    props.creatorDisplayName,
                )}
            </p>
            <div onChange={toggleExistingOpponent} className={css.radioGroup}>
                <FancyRadio
                    text="NOTIFICATIONS.ACCEPT_LINKED.RADIO_EXISTING"
                    icon={Icons.ExistingUser}
                    value="existing"
                    inputName="useExisting"
                    selectedValue={useExistingOpponent && "existing"}
                    selectedClassName={css.selectedOption}
                />
                <FancyRadio
                    text="NOTIFICATIONS.ACCEPT_LINKED.RADIO_NEW"
                    icon={Icons.NewUser}
                    value="new"
                    inputName="useExisting"
                    selectedValue={!useExistingOpponent && "new"}
                    selectedClassName={css.selectedOption}
                />
            </div>

            {FormComponent}
        </div>
    );
};

export default React.memo(AcceptInvitationSelectOpponent);

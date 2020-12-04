import React from "react";
import useTranslations from "app/locale/__hooks/useTranslations";
import LinkButton from "library/link-button/LinkButton";
import { appRoutes } from "app/routing/routes";
import Icons from "library/icons/Icons";

interface AddPlayButtonProps {
    className?: string;
}

const AddPlayButton: React.FC<AddPlayButtonProps> = props => {
    const { translate } = useTranslations();

    return (
        <LinkButton
            href={appRoutes.plays.add}
            tabIndex={1}
            leftIcon={Icons.PlusIcon}
            text={translate("PLAYS.LIST.ADD_BUTTON")}
            color="accent"
            {...props}
        />
    );
};

export default React.memo(AddPlayButton);

import React from "react";
import useTranslations from "app/locale/__hooks/useTranslations";
import LinkButton from "library/link-button/LinkButton";
import { appRoutes } from "app/routing/routes";
import { ReactComponent as PlusIcon } from "app/board-games/list/add-button/plus.svg";

interface AddOpponentButtonProps {
    className: string;
}

const AddOpponentButton: React.FC<AddOpponentButtonProps> = props => {
    const { translate } = useTranslations();

    return (
        <LinkButton
            href={appRoutes.opponents.add}
            tabIndex={1}
            leftIcon={<PlusIcon />}
            text={translate("OPPONENTS.LIST.ADD_BUTTON")}
            color="accent"
            {...props}
        />
    );
};

export default React.memo(AddOpponentButton);

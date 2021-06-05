import React from "react";
import LinkButton from "library/link-button/LinkButton";
import { appRoutes } from "app/routing/routes";
import Icons from "library/icons/Icons";

interface AddOpponentButtonProps {
    className: string;
}

const AddOpponentButton: React.FC<AddOpponentButtonProps> = props => (
    <LinkButton
        href={appRoutes.opponents.add}
        tabIndex={1}
        leftIcon={Icons.PlusIcon}
        text="OPPONENTS.LIST.ADD_BUTTON"
        color="accent"
        {...props}
    />
);

export default React.memo(AddOpponentButton);

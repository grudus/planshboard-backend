import React from "react";
import LinkButton from "library/link-button/LinkButton";
import { appRoutes } from "app/routing/routes";
import Icons from "library/icons/Icons";

interface AddPlayButtonProps {
    className?: string;
}

const AddPlayButton: React.FC<AddPlayButtonProps> = props => (
    <LinkButton
        href={appRoutes.plays.add}
        tabIndex={1}
        leftIcon={Icons.PlusIcon}
        text="PLAYS.LIST.ADD_BUTTON"
        color="accent"
        {...props}
    />
);

export default React.memo(AddPlayButton);

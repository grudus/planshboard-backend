import React from "react";
import LinkButton from "library/link-button/LinkButton";
import { appRoutes } from "app/routing/routes";
import Icons from "library/icons/Icons";

interface AddBoardGameButtonProps {
    className?: string;
}

const AddBoardGameButton: React.FC<AddBoardGameButtonProps> = props => (
    <LinkButton
        href={appRoutes.boardGame.add}
        tabIndex={1}
        leftIcon={Icons.PlusIcon}
        text="BOARD_GAMES.LIST.ADD_BUTTON"
        color="accent"
        {...props}
    />
);

export default React.memo(AddBoardGameButton);

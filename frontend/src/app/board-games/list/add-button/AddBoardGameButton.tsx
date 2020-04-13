import React from "react";
import useTranslations from "app/locale/__hooks/useTranslations";
import css from "./add-board-game-button.module.scss";
import { ReactComponent as PlusIcon } from "./plus.svg";
import LinkButton from "library/link-button/LinkButton";
import { appRoutes } from "app/routing/routes";

interface AddBoardGameButtonProps {
    className: string;
}

const AddBoardGameButton: React.FC<AddBoardGameButtonProps> = props => {
    const { translate } = useTranslations();

    return (
        <LinkButton
            href={appRoutes.boardGames.add}
            tabIndex={1}
            className={css.button}
            leftIcon={<PlusIcon />}
            text={translate("BOARD_GAMES.LIST.ADD_BUTTON")}
            color="accent"
            {...props}
        />
    );
};

export default React.memo(AddBoardGameButton);

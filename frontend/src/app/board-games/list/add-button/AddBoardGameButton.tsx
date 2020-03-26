import React from "react";
import useTranslations from "app/locale/hooks/useTranslations";
import Button from "library/button/Button";
import css from "./add-board-game-button.module.scss";
import { ReactComponent as PlusIcon } from "./plus.svg";

interface AddBoardGameButtonProps {
    className: string;
}

const AddBoardGameButton: React.FC<AddBoardGameButtonProps> = props => {
    const { translate } = useTranslations();

    return (
        <Button
            className={css.button}
            leftIcon={<PlusIcon />}
            text={translate("BOARD_GAMES.LIST.ADD_BUTTON")}
            color="accent"
            {...props}
        />
    );
};

export default React.memo(AddBoardGameButton);

import React from "react";
import useTranslations from "app/locale/__hooks/useTranslations";
import css from "./no-board-games-placeholder.module.scss";
import { ReactComponent as EmptyImage } from "./no-plays.svg";
import MediumTitle from "library/text/MediumTitle";

const NoBoardGamesPlaceholder: React.FC = () => {
    const { translate } = useTranslations();

    return (
        <div className={css.emptyWrapper}>
            {<EmptyImage />}
            <MediumTitle className={css.emptyText}>
                {translate("BOARD_GAMES.LIST.EMPTY.TOP")}
                <br />
                {translate("BOARD_GAMES.LIST.EMPTY.BOTTOM")}
            </MediumTitle>
        </div>
    );
};

export default NoBoardGamesPlaceholder;

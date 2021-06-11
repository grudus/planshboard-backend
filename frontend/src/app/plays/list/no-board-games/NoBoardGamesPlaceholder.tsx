import React from "react";
import css from "./no-board-games-placeholder.module.scss";
import Heading from "library/text/Heading";

const NoBoardGamesPlaceholder: React.FC = () => (
    <div className={css.emptyWrapper}>
        <img src="img/plays-no-board-games.svg" alt="No board games" />
        <div className={css.emptyText}>
            <Heading variant="h2" text="BOARD_GAMES.LIST.EMPTY.TOP" />
            <Heading variant="h2" text="BOARD_GAMES.LIST.EMPTY.BOTTOM" />
        </div>
    </div>
);

export default React.memo(NoBoardGamesPlaceholder);

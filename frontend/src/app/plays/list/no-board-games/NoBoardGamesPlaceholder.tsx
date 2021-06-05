import React from "react";
import css from "./no-board-games-placeholder.module.scss";
import { ReactComponent as EmptyImage } from "./no-board-games.svg";
import Heading from "library/text/Heading";

const NoBoardGamesPlaceholder: React.FC = () => (
    <div className={css.emptyWrapper}>
        {<EmptyImage />}
        <div>
            <Heading variant="h2" className={css.emptyText} text="BOARD_GAMES.LIST.EMPTY.TOP" />
            <Heading variant="h2" className={css.emptyText} text="BOARD_GAMES.LIST.EMPTY.BOTTOM" />
        </div>
    </div>
);

export default React.memo(NoBoardGamesPlaceholder);

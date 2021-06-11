import React from "react";
import css from "app/board-games/list/empty/empty-list-placeholder.module.scss";
import Heading from "library/text/Heading";

const EmptyListPlaceholder: React.FC = () => (
    <div className={css.emptyWrapper}>
        <img src="img/no-board-games.svg" alt="No games" />
        <div className={css.emptyText}>
            <Heading variant="h2" text="BOARD_GAMES.LIST.EMPTY.TOP" />
            <Heading variant="h2" text="BOARD_GAMES.LIST.EMPTY.BOTTOM" />
        </div>
    </div>
);

export default React.memo(EmptyListPlaceholder);

import React from "react";
import css from "app/plays/list/no-board-games/no-board-games-placeholder.module.scss";
import Heading from "library/text/Heading";

const NoPlaysPlaceholder: React.FC = () => (
    <div className={css.emptyWrapper}>
        <img src="img/no-plays.svg" alt="No plays" />
        <div className={css.emptyText}>
            <Heading variant="h2" text="PLAYS.LIST.EMPTY.TOP" />
            <Heading variant="h2" text="PLAYS.LIST.EMPTY.BOTTOM" />
        </div>
    </div>
);

export default React.memo(NoPlaysPlaceholder);

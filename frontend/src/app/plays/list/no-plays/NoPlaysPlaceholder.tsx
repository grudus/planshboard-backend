import React from "react";
import css from "app/plays/list/no-board-games/no-board-games-placeholder.module.scss";
import { ReactComponent as EmptyImage } from "./no-plays.svg";
import Heading from "library/text/Heading";

const NoPlaysPlaceholder: React.FC = () => (
    <div className={css.emptyWrapper}>
        {<EmptyImage />}
        <div>
            <Heading variant="h2" className={css.emptyText} text="PLAYS.LIST.EMPTY.TOP" />
            <Heading variant="h2" className={css.emptyText} text="PLAYS.LIST.EMPTY.BOTTOM" />
        </div>
    </div>
);

export default React.memo(NoPlaysPlaceholder);

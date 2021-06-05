import React from "react";
import css from "app/board-games/list/empty/empty-list-placeholder.module.scss";
import { ReactComponent as EmptyImage } from "app/board-games/list/empty.svg";
import Heading from "library/text/Heading";

const EmptyListPlaceholder: React.FC = () => (
    <div className={css.emptyWrapper}>
        {<EmptyImage />}
        <div>
            <Heading variant="h2" className={css.emptyText} text="BOARD_GAMES.LIST.EMPTY.TOP" />
            <Heading variant="h2" className={css.emptyText} text="BOARD_GAMES.LIST.EMPTY.BOTTOM" />
        </div>
    </div>
);

export default React.memo(EmptyListPlaceholder);

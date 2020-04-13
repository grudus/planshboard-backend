import React from "react";
import css from "app/board-games/list/empty/empty-list-placeholder.module.scss";
import { ReactComponent as EmptyImage } from "app/board-games/list/empty.svg";
import MediumTitle from "library/text/MediumTitle";
import useTranslations from "app/locale/__hooks/useTranslations";

const EmptyListPlaceholder: React.FC = () => {
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

export default React.memo(EmptyListPlaceholder);

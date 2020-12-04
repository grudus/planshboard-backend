import React from "react";
import useTranslations from "app/locale/__hooks/useTranslations";
import css from "app/plays/list/no-board-games/no-board-games-placeholder.module.scss";
import { ReactComponent as EmptyImage } from "./no-plays.svg";
import MediumTitle from "library/text/MediumTitle";

const NoPlaysPlaceholder: React.FC = () => {
    const { translate } = useTranslations();

    return (
        <div className={css.emptyWrapper}>
            {<EmptyImage />}
            <MediumTitle className={css.emptyText}>
                {translate("PLAYS.LIST.EMPTY.TOP")}
                <br />
                {translate("PLAYS.LIST.EMPTY.BOTTOM")}
            </MediumTitle>
        </div>
    );
};

export default NoPlaysPlaceholder;

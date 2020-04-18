import React from "react";
import { OpponentListItem as ListItem } from "app/opponents/__models/OpponentModels";
import css from "./opponent-list-item.module.scss";
import { appRoutes } from "app/routing/routes";
import { Link } from "react-router-dom";
import Avatar from "library/avatar/Avatar";
import useTranslations from "app/locale/__hooks/useTranslations";
import Icons from "library/icons/Icons";

interface OpponentListItemProps {
    opponent: ListItem;
}

const OpponentListItem: React.FC<OpponentListItemProps> = props => {
    const { translate } = useTranslations();

    const winsRatio = props.opponent.numberOfPlays
        ? Math.round((100 * props.opponent.numberOfWins) / props.opponent.numberOfPlays)
        : 0;

    return (
        <Link className={css.linkWrapper} to={appRoutes.opponents.edit.replace(":id", props.opponent.id.toString())}>
            <section className={css.item} title={props.opponent.name}>
                <Avatar image={Icons.NoImageUserIcon} name={props.opponent.name} />
                <h3 className={css.opponentName}>{props.opponent.name}</h3>
                <div className={css.stats}>
                    <div className={css.row}>
                        <span>{translate("OPPONENTS.LIST.LAST_PLAY")}</span>
                        <span>{props.opponent.lastPlayedBoardGame ?? "-"}</span>
                    </div>
                    <div className={css.row}>
                        <span>{translate("OPPONENTS.LIST.NUMBER_OF_PLAYS")}</span>
                        <span>{props.opponent.numberOfPlays}</span>
                    </div>
                    <div className={css.row}>
                        <span>{translate("OPPONENTS.LIST.NUMBER_OF_WINS")}</span>
                        <span>{props.opponent.numberOfWins}</span>
                    </div>
                    <div className={css.row}>
                        <span>{translate("OPPONENTS.LIST.WINS_RATIO")}</span>
                        <span>{winsRatio}%</span>
                    </div>
                </div>
            </section>
        </Link>
    );
};

export default OpponentListItem;

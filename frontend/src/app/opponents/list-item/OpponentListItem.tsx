import React from "react";
import { Opponent, OpponentListItem as ListItem } from "app/opponents/__models/OpponentModels";
import css from "./opponent-list-item.module.scss";
import { appRoutes } from "app/routing/routes";
import IconButton from "library/icon-button/IconButton";
import { ReactComponent as DeleteIcon } from "app/board-games/list-item/delete.svg";
import { Link } from "react-router-dom";
import { ReactComponent as NoImageIcon } from "./avatar.svg";
import Avatar from "library/avatar/Avatar";
import useTranslations from "app/locale/__hooks/useTranslations";

interface OpponentListItemProps {
    opponent: ListItem;
    onDeleteClick: (opponent: Opponent) => void;
}

const OpponentListItem: React.FC<OpponentListItemProps> = props => {
    const { translate } = useTranslations();
    const onDeleteClick = () => {
        props.onDeleteClick(props.opponent);
    };
    const winsRatio = props.opponent.numberOfPlays
        ? Math.round((100 * props.opponent.numberOfWins) / props.opponent.numberOfPlays)
        : 0;

    return (
        <Link className={css.linkWrapper} to={appRoutes.opponents.edit.replace(":id", props.opponent.id.toString())}>
            <section className={css.item} title={props.opponent.name}>
                <Avatar image={<NoImageIcon />} name={props.opponent.name} />
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
            <IconButton svgIcon={<DeleteIcon />} onClick={onDeleteClick} className={css.deleteButton} />
        </Link>
    );
};

export default OpponentListItem;

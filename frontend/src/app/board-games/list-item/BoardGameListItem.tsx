import React from "react";
import css from "./board-game-list-item.module.scss";
import { appRoutes } from "app/routing/routes";
import MediumTitle from "library/text/MediumTitle";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "./delete.svg";
import IconButton from "library/icon-button/IconButton";

interface BoardGameListItemProps {
    onDeleteIconClick: (id: number) => void;
    game: {
        id: number;
        name: string;
    };
}

const BoardGameListItem: React.FC<BoardGameListItemProps> = props => {
    const onDeleteClick = () => {
        props.onDeleteIconClick(props.game.id);
    };
    return (
        <Link className={css.linkWrapper} to={appRoutes.boardGames.edit.replace(":id", props.game.id.toString())}>
            <section className={css.item} title={props.game.name}>
                <MediumTitle className={css.boardGameName}>{props.game.name}</MediumTitle>
                <IconButton svgIcon={<DeleteIcon />} onClick={onDeleteClick} className={css.deleteButton} />
            </section>
        </Link>
    );
};

export default React.memo(BoardGameListItem);

import React from "react";
import css from "./board-game-list-item.module.scss";
import { appRoutes } from "app/routing/routes";
import MediumTitle from "library/text/MediumTitle";
import { Link } from "react-router-dom";

interface BoardGameListItemProps {
    game: {
        id: number;
        name: string;
    };
}

const BoardGameListItem: React.FC<BoardGameListItemProps> = props => (
    <Link className={css.linkWrapper} to={appRoutes.boardGames.edit.replace(":id", props.game.id.toString())}>
        <section className={css.item} title={props.game.name}>
            <MediumTitle className={css.boardGameName}>{props.game.name}</MediumTitle>
        </section>
    </Link>
);

export default React.memo(BoardGameListItem);

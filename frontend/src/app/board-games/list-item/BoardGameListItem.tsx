import React from "react";
import css from "./board-game-list-item.module.scss";
import { appRoutes } from "app/routing/routes";
import MediumTitle from "library/text/MediumTitle";

interface BoardGameListItemProps {
    game: {
        id: number;
        name: string;
    };
}

const BoardGameListItem: React.FC<BoardGameListItemProps> = props => (
    <a className={css.linkWrapper} href={appRoutes.boardGames.list}>
        <section className={css.item} title={props.game.name}>
            <MediumTitle className={css.boardGameName}>{props.game.name}</MediumTitle>
        </section>
    </a>
);

export default React.memo(BoardGameListItem);

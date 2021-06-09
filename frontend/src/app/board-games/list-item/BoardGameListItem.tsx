import React from "react";
import css from "./board-game-list-item.module.scss";
import { appRoutes } from "app/routing/routes";
import { Link } from "react-router-dom";
import Heading from "library/text/Heading";
import BoardGameItemContextMenu from "app/board-games/list-item/BoardGameItemContextMenu";

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
        <Link className={css.linkWrapper} to={appRoutes.boardGame.edit.replace(":id", props.game.id.toString())}>
            <section className={css.item} title={props.game.name}>
                <Heading variant="h4" text={props.game.name} className={css.boardGameName} noTranslation />
                <BoardGameItemContextMenu onDeleteClick={onDeleteClick} />
            </section>
        </Link>
    );
};

export default React.memo(BoardGameListItem);

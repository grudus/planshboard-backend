import React from "react";
import css from "./board-game-list-item.module.scss";
import { appRoutes } from "app/routing/routes";
import { Link } from "react-router-dom";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";
import Heading from "library/text/Heading";

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
                <IconButton svgIcon={Icons.DeleteIcon} onClick={onDeleteClick} className={css.deleteButton} />
            </section>
        </Link>
    );
};

export default React.memo(BoardGameListItem);

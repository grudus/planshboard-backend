import React from "react";
import css from "./board-game-list-item.module.scss";
import Heading from "library/text/Heading";

interface BoardGameListItemProps {
    contextMenuItem?: React.ReactNode;
    game: {
        id: number;
        name: string;
    };
}

const BoardGameListItem: React.FC<BoardGameListItemProps> = props => {
    return (
        <div className={css.linkWrapper}>
            <section className={css.item} title={props.game.name}>
                <Heading variant="h4" text={props.game.name} className={css.boardGameName} noTranslation />
            </section>
            {props.contextMenuItem}
        </div>
    );
};

export default React.memo(BoardGameListItem);

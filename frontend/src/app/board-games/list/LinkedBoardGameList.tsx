import React from "react";
import Heading from "library/text/Heading";
import FlipMove from "react-flip-move";
import css from "app/board-games/list/board-game-list.module.scss";
import BoardGameListItem from "app/board-games/list-item/BoardGameListItem";
import LinkedBoardGameItemContextMenu from "app/board-games/list-item/LinkedBoardGameItemContextMenu";
import { useRedux } from "store/rootReducer";
import Tag from "library/tags/Tag";

interface LinkedBoardGameListProps {
    filterCondition: (text: string) => boolean;
}

const LinkedBoardGameList: React.FC<LinkedBoardGameListProps> = props => {
    const { linked: linkedBoardGames } = useRedux(state => state.boardGame);

    if (!linkedBoardGames?.length) {
        return <></>;
    }

    return (
        <>
            <Heading variant="h5" text="BOARD_GAMES.LINKED.HEADER" />

            <FlipMove className={css.list} typeName="ul">
                {linkedBoardGames
                    ?.filter(game => props.filterCondition(game.creatorBoardGame.name))
                    ?.map(boardGame => (
                        <li key={boardGame.creatorBoardGame.id} className={css.singleItem}>
                            <BoardGameListItem
                                game={boardGame.creatorBoardGame}
                                contextMenuItem={<LinkedBoardGameItemContextMenu />}
                            />
                            <Tag text={boardGame.creator.name} color="neutral" className={css.gameCreatorChip} />
                        </li>
                    ))}
            </FlipMove>
        </>
    );
};

export default LinkedBoardGameList;

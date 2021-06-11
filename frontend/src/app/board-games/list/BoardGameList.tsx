import React, { useCallback } from "react";
import css from "./board-game-list.module.scss";
import { useRedux } from "store/rootReducer";
import DeleteBoardGameDialog from "app/board-games/list/dialog/DeleteBoardGameDialog";
import FlipMove from "react-flip-move";
import useDialog from "library/dialog/context/useDialog";
import { BoardGameActions } from "app/board-games/__store/boardGameActions";
import BoardGameListItem from "app/board-games/list-item/BoardGameListItem";
import { useAppDispatch } from "store/useAppDispatch";
import BoardGameItemContextMenu from "app/board-games/list-item/BoardGameItemContextMenu";

interface BoardGameListProps {
    filterCondition: (text: string) => boolean;
}

const BoardGameList: React.FunctionComponent<BoardGameListProps> = props => {
    const { showDialog } = useDialog();
    const dispatch = useAppDispatch();
    const { list: boardGames } = useRedux(state => state.boardGame);

    const confirmDeleteItem = useCallback(
        (id: number) => dispatch(BoardGameActions.deleteBoardGame({ id })),
        [dispatch],
    );

    const deleteGameRequest = useCallback(
        (id: number) => showDialog(<DeleteBoardGameDialog onConfirm={() => confirmDeleteItem(id)} />),
        [confirmDeleteItem, showDialog],
    );

    return (
        <FlipMove className={css.list} typeName="ul">
            {boardGames
                ?.filter(game => props.filterCondition(game.name))
                ?.map(boardGame => (
                    <li key={boardGame.id} className={css.singleItem}>
                        <BoardGameListItem
                            game={boardGame}
                            contextMenuItem={
                                <BoardGameItemContextMenu onDeleteClick={deleteGameRequest} gameId={boardGame.id} />
                            }
                        />
                    </li>
                ))}
        </FlipMove>
    );
};

export default BoardGameList;

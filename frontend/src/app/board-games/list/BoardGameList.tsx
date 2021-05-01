import React, { useCallback, useEffect } from "react";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { deleteBoardGameRequest, getBoardGamesRequest } from "app/board-games/BoardGameApi";
import css from "./board-game-list.module.scss";
import BoardGameListItem from "app/board-games/list-item/BoardGameListItem";
import EmptyListPlaceholder from "app/board-games/list/empty/EmptyListPlaceholder";
import { useRedux } from "store/rootReducer";
import AddBoardGameButton from "app/board-games/list/add-button/AddBoardGameButton";
import DeleteBoardGameDialog from "app/board-games/list/dialog/DeleteBoardGameDialog";
import FlipMove from "react-flip-move";
import SearchInput from "library/search-input/SearchInput";
import useFilter from "app/shared/hooks/useFilter";
import useDialog from "library/dialog/context/useDialog";

const BoardGameList: React.FunctionComponent<any> = () => {
    const { showDialog } = useDialog();
    const { setFilter, filterCondition } = useFilter();
    const dispatch = useHttpDispatch();
    const { list: boardGames, boardGameExists } = useRedux(state => state.boardGame);

    const confirmDeleteItem = useCallback((id: number) => deleteBoardGameRequest(dispatch, { id }), [dispatch]);

    const deleteGameRequest = useCallback(
        (id: number) => showDialog(<DeleteBoardGameDialog onConfirm={() => confirmDeleteItem(id)} />),
        [confirmDeleteItem, showDialog],
    );

    useEffect(() => {
        getBoardGamesRequest(dispatch);
    }, [dispatch]);

    if (!boardGameExists) {
        return (
            <>
                <EmptyListPlaceholder />
                <AddBoardGameButton className={css.addButton} />
            </>
        );
    }

    return (
        <div>
            <div className={css.searchWrapper}>
                <SearchInput onTextChange={setFilter} hideLabel />
            </div>
            <FlipMove className={css.list} typeName="ul">
                {boardGames
                    .filter(game => filterCondition(game.name))
                    .map(boardGame => (
                        <li key={boardGame.id} className={css.singleItem}>
                            <BoardGameListItem game={boardGame} onDeleteIconClick={deleteGameRequest} />
                        </li>
                    ))}
            </FlipMove>
            <AddBoardGameButton className={css.addButton} />
        </div>
    );
};

export default BoardGameList;

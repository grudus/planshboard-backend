import React, { useEffect, useState } from "react";
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

const BoardGameList: React.FunctionComponent<any> = () => {
    const [idToDelete, setIdToDelete] = useState(null as number | null);
    const { setFilter, filterCondition } = useFilter();
    const dispatch = useHttpDispatch();
    const { list: boardGames, boardGameExists } = useRedux(state => state.boardGame);

    const confirmDeleteItem = async () => {
        await deleteBoardGameRequest(dispatch, { id: idToDelete!! });
        cancelDeleteItem();
    };
    const cancelDeleteItem = () => {
        setIdToDelete(null);
    };

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
                            <BoardGameListItem game={boardGame} onDeleteIconClick={setIdToDelete} />
                        </li>
                    ))}
            </FlipMove>
            <AddBoardGameButton className={css.addButton} />

            <DeleteBoardGameDialog open={!!idToDelete} onConfirm={confirmDeleteItem} onCancel={cancelDeleteItem} />
        </div>
    );
};

export default BoardGameList;

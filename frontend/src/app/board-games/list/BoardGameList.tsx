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

const BoardGameList: React.FunctionComponent<any> = () => {
    const [idToDelete, setIdToDelete] = useState(null as number | null);
    const [filter, setFilter] = useState("");
    const dispatch = useHttpDispatch();
    const boardGames = useRedux(state => state.boardGame.list);

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

    if (boardGames?.length === 0) {
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
                    .filter(game => !filter || game.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
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

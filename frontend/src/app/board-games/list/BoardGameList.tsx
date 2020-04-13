import React, { useEffect, useState } from "react";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { deleteBoardGameRequest, getBoardGamesRequest } from "app/board-games/BoardGameApi";
import css from "./board-game-list.module.scss";
import BoardGameListItem from "app/board-games/list-item/BoardGameListItem";
import EmptyListPlaceholder from "app/board-games/list/empty/EmptyListPlaceholder";
import { useRedux } from "store/rootReducer";
import AddBoardGameButton from "app/board-games/list/add-button/AddBoardGameButton";
import DeleteBoardGameDialog from "app/board-games/list/dialog/DeleteBoardGameDialog";

const BoardGameList: React.FunctionComponent<any> = () => {
    const [idToDelete, setIdToDelete] = useState(null as number | null);
    const dispatch = useHttpDispatch();
    const boardGames = useRedux(state => state.boardGames.list);

    const confirmDeleteItem = async () => {
        await deleteBoardGameRequest(dispatch, { id: idToDelete!! });
        cancelDeleteItem();
    };
    const cancelDeleteItem = () => {
        setIdToDelete(null);
    };

    useEffect(() => {
        getBoardGamesRequest(dispatch);
        // eslint-disable-next-line
    }, []);

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
            <ul className={css.list}>
                {boardGames.map(boardGame => (
                    <li key={boardGame.id} className={css.singleItem}>
                        <BoardGameListItem game={boardGame} onDeleteIconClick={setIdToDelete} />
                    </li>
                ))}
            </ul>
            <AddBoardGameButton className={css.addButton} />

            <DeleteBoardGameDialog open={!!idToDelete} onConfirm={confirmDeleteItem} onCancel={cancelDeleteItem} />
        </div>
    );
};

export default BoardGameList;

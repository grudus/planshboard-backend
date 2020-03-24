import React, { useEffect } from "react";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { getBoardGamesRequest } from "app/board-games/BoardGameApi";
import { useRedux } from "store/rootReducer";
import css from "./board-game-list.module.scss";
import BoardGameListItem from "app/board-games/list-item/BoardGameListItem";

const BoardGameList: React.FunctionComponent<any> = () => {
    const dispatch = useHttpDispatch();
    const boardGames = useRedux(state => state.boardGames.list);

    useEffect(() => {
        getBoardGamesRequest(dispatch);
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <ul className={css.list}>
                {boardGames.map(boardGame => (
                    <li key={boardGame.id} className={css.singleItem}>
                        <BoardGameListItem game={boardGame} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BoardGameList;

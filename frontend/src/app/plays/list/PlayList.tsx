import React, { useEffect } from "react";
import { useRedux } from "store/rootReducer";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { getAllPlaysRequest } from "app/plays/PlayApi";
import NoBoardGamesPlaceholder from "app/plays/list/no-board-games/NoBoardGamesPlaceholder";
import AddBoardGameButton from "app/board-games/list/add-button/AddBoardGameButton";
import css from "./play-list.module.scss";
import NoPlaysPlaceholder from "app/plays/list/no-plays/NoPlaysPlaceholder";
import AddPlayButton from "app/plays/list/add-button/AddPlayButton";

const PlayList: React.FC = () => {
    const plays = useRedux(state => state.play.list);
    const boardGameExists = useRedux(state => state.boardGame.boardGameExists);
    const dispatch = useHttpDispatch();

    useEffect(() => {
        getAllPlaysRequest(dispatch);
    }, [dispatch]);

    if (!boardGameExists) {
        return (
            <>
                <NoBoardGamesPlaceholder />
                <AddBoardGameButton className={css.addButton} />
            </>
        );
    }

    if (!plays.length) {
        return (
            <>
                <NoPlaysPlaceholder />
                <AddPlayButton className={css.addButton} />
            </>
        );
    }

    return (
        <>
            <div>Hello PlayList</div>

            <ul>
                {plays?.map(play => (
                    <li key={play.id}>{JSON.stringify(play)}</li>
                ))}
            </ul>
        </>
    );
};

export default PlayList;

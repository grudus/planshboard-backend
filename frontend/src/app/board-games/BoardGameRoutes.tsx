import React from "react";
import { Route } from "react-router-dom";
import BoardGameList from "app/board-games/list/BoardGameList";
import { appRoutes } from "../routing/routes";

const BoardGameRoutes: React.FunctionComponent<any> = () => (
    <>
        <Route path={appRoutes.boardGames.list}>
            <BoardGameList />
        </Route>
    </>
);

export default BoardGameRoutes;

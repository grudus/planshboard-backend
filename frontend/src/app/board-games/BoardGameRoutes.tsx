import React from "react";
import { Route, Switch } from "react-router-dom";
import BoardGameList from "app/board-games/list/BoardGameList";
import { appRoutes } from "../routing/routes";
import AddBoardGame from "app/board-games/add/AddBoardGame";

const BoardGameRoutes: React.FunctionComponent<any> = () => (
    <Switch>
        <Route path={appRoutes.boardGames.add}>
            <AddBoardGame />
        </Route>
        <Route path={appRoutes.boardGames.list}>
            <BoardGameList />
        </Route>
    </Switch>
);

export default BoardGameRoutes;

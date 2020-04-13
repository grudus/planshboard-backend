import React from "react";
import { Route, Switch } from "react-router-dom";
import BoardGameList from "app/board-games/list/BoardGameList";
import { appRoutes } from "../routing/routes";
import AddBoardGame from "app/board-games/add/AddBoardGame";
import EditBoardGame from "app/board-games/edit/EditBoardGame";

const BoardGameRoutes: React.FunctionComponent<any> = () => (
    <Switch>
        <Route path={appRoutes.boardGame.add}>
            <AddBoardGame />
        </Route>
        <Route path={appRoutes.boardGame.edit}>
            <EditBoardGame />
        </Route>
        <Route path={appRoutes.boardGame.list}>
            <BoardGameList />
        </Route>
    </Switch>
);

export default BoardGameRoutes;

import React from "react";
import { Route, Switch } from "react-router-dom";
import { appRoutes } from "../routing/routes";
import AddBoardGame from "app/board-games/add/AddBoardGame";
import EditBoardGame from "app/board-games/edit/EditBoardGame";
import BoardGamesView from "app/board-games/view/BoardGamesView";

const BoardGameRoutes: React.FunctionComponent<any> = () => (
    <Switch>
        <Route path={appRoutes.boardGame.add}>
            <AddBoardGame />
        </Route>
        <Route path={appRoutes.boardGame.edit}>
            <EditBoardGame />
        </Route>
        <Route path={appRoutes.boardGame.list}>
            <BoardGamesView />
        </Route>
    </Switch>
);

export default BoardGameRoutes;

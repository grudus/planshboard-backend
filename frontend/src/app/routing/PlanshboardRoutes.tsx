import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthRoutes from "../auth/AuthRoutes";
import BoardGameRoutes from "../board-games/BoardGameRoutes";
import { appRoutes } from "./routes";
import Stats from "app/stats/Stats";
import Ranking from "app/ranking/Ranking";
import Notifications from "app/notifications/Notifications";
import Settings from "app/settings/Settings";
import OpponentRoutes from "app/opponents/OpponentRoutes";
import PlayRoutes from "app/plays/PlayRoutes";
import Logout from "app/auth/logout/Logout";

const PlashboardRoutes: React.FunctionComponent<any> = () => (
    <>
        <AuthRoutes />
        <BoardGameRoutes />
        <OpponentRoutes />
        <PlayRoutes />
        <Route path={appRoutes.stats}>
            <Stats />
        </Route>
        <Route path={appRoutes.ranking}>
            <Ranking />
        </Route>
        <Route path={appRoutes.notifications}>
            <Notifications />
        </Route>
        <Route path={appRoutes.settings}>
            <Logout />
        </Route>
        <Route exact path={appRoutes.home}>
            <Redirect to={appRoutes.boardGame.list} />
        </Route>
    </>
);

export default PlashboardRoutes;

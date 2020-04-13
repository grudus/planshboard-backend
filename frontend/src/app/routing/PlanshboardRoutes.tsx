import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthRoutes from "../auth/AuthRoutes";
import BoardGameRoutes from "../board-games/BoardGameRoutes";
import { appRoutes } from "./routes";
import Plays from "app/plays/Plays";
import Stats from "app/stats/Stats";
import Ranking from "app/ranking/Ranking";
import Notifications from "app/notifications/Notifications";
import Settings from "app/settings/Settings";
import OpponentRoutes from "app/opponents/OpponentRoutes";

const PlashboardRoutes: React.FunctionComponent<any> = () => (
    <>
        <AuthRoutes />
        <BoardGameRoutes />
        <OpponentRoutes />
        <Route path={appRoutes.plays}>
            <Plays />
        </Route>
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
            <Settings />
        </Route>
        <Route exact path={appRoutes.home}>
            <Redirect to={appRoutes.boardGames.list} />
        </Route>
    </>
);

export default PlashboardRoutes;

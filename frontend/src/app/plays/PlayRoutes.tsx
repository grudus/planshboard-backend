import React from "react";
import { Route, Switch } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import PlayList from "app/plays/list/PlayList";
import AddPlay from "app/plays/add/AddPlay";

const PlayRoutes: React.FC = () => (
    <Switch>
        <Route path={appRoutes.plays.add}>
            <AddPlay />
        </Route>
        <Route path={appRoutes.plays.edit}>
            <AddPlay />
        </Route>
        <Route path={appRoutes.plays.list}>
            <AddPlay />
        </Route>
    </Switch>
);

export default PlayRoutes;

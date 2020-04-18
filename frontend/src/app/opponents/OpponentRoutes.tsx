import React from "react";
import { Route, Switch } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import OpponentList from "app/opponents/list/OpponentList";
import AddOpponent from "app/opponents/add/AddOpponent";
import OpponentProfile from "app/opponents/profile/OpponentProfile";

const OpponentRoutes: React.FunctionComponent<any> = () => (
    <Switch>
        <Route path={appRoutes.opponents.add}>
            <AddOpponent />
        </Route>
        <Route path={appRoutes.opponents.edit}>
            <OpponentProfile />
        </Route>
        <Route path={appRoutes.opponents.list}>
            <OpponentList />
        </Route>
    </Switch>
);
export default OpponentRoutes;

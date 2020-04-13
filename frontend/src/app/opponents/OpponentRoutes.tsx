import React from "react";
import { Route, Switch } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import OpponentList from "app/opponents/list/OpponentList";

const OpponentRoutes: React.FunctionComponent<any> = () => (
    <Switch>
        <Route path={appRoutes.opponents.list}>
            <OpponentList />
        </Route>
    </Switch>
);
export default OpponentRoutes;

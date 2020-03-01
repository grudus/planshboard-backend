import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./login/Login";
import Registration from "./registration/Registration";
import { appRoutes } from "../routing/routes";

const AuthRoutes: React.FunctionComponent<any> = () => (
    <Switch>
        <Route path={appRoutes.auth.login}>
            <Login />
        </Route>
        <Route path={appRoutes.auth.registration}>
            <Registration />
        </Route>
        <Route path={appRoutes.auth.base}>
            <Redirect to={appRoutes.auth.login} />
        </Route>
    </Switch>
);

export default AuthRoutes;

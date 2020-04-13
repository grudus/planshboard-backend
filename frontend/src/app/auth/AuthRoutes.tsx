import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./login/Login";
import Registration from "./registration/Registration";
import { appRoutes } from "../routing/routes";
import Logout from "app/auth/logout/Logout";

const AuthRoutes: React.FunctionComponent<any> = () => (
    <Switch>
        <Route path={appRoutes.auth.login}>
            <Login />
        </Route>
        <Route path={appRoutes.auth.registration}>
            <Registration />
        </Route>
        <Route path={appRoutes.auth.logout}>
            <Logout />
        </Route>
    </Switch>
);

export default React.memo(AuthRoutes);

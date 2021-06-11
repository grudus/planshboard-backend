import React from "react";
import { Route, Switch } from "react-router-dom";
import { appRoutes } from "../routing/routes";
import Logout from "app/auth/logout/Logout";

const AuthRoutes: React.FunctionComponent<any> = () => {
    const Login = React.lazy(() => import("./login/Login"));
    const Registration = React.lazy(() => import("./registration/Registration"));

    return (
        <Switch>
            <Route path={appRoutes.auth.login}>
                <React.Suspense fallback={<></>}>
                    <Login />
                </React.Suspense>
            </Route>
            <Route path={appRoutes.auth.registration}>
                <React.Suspense fallback={<></>}>
                    <Registration />
                </React.Suspense>
            </Route>
            <Route path={appRoutes.auth.logout}>
                <Logout />
            </Route>
        </Switch>
    );
};

export default React.memo(AuthRoutes);

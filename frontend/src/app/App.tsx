import React from "react";
import PlashboardRoutes from "./routing/PlanshboardRoutes";
import { Provider } from "react-redux";
import { history, planshboardStore } from "store/configureStore";
import LocaleLoadedGuard from "app/locale/LocaleLoadedGuard";
import { ConnectedRouter } from "connected-react-router";

const App: React.FC = () => {
    return (
        <Provider store={planshboardStore}>
            <ConnectedRouter history={history}>
                <LocaleLoadedGuard>
                    <PlashboardRoutes />
                </LocaleLoadedGuard>
            </ConnectedRouter>
        </Provider>
    );
};

export default App;

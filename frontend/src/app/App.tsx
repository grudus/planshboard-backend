import React from "react";
import PlashboardRoutes from "./routing/PlanshboardRoutes";
import { Provider } from "react-redux";
import { history, planshboardStore } from "store/configureStore";
import LocaleLoadedGuard from "app/locale/LocaleLoadedGuard";
import { ConnectedRouter } from "connected-react-router";
import NavBar from "app/nav-bar/NavBar";
import { DialogProvider } from "library/dialog/context/DialogContext";

const App: React.FC = () => {
    return (
        <Provider store={planshboardStore}>
            <ConnectedRouter history={history}>
                <LocaleLoadedGuard>
                    <DialogProvider>
                        <NavBar>
                            <PlashboardRoutes />
                        </NavBar>
                    </DialogProvider>
                </LocaleLoadedGuard>
            </ConnectedRouter>
        </Provider>
    );
};

export default App;

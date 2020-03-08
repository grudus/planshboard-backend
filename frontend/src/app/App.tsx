import React from "react";
import { BrowserRouter } from "react-router-dom";
import PlashboardRoutes from "./routing/PlanshboardRoutes";
import { Provider } from "react-redux";
import { planshboardStore } from "store/configureStore";
import LocaleLoadedGuard from "app/locale/LocaleLoadedGuard";

const App: React.FC = () => {
    return (
        <Provider store={planshboardStore}>
            <BrowserRouter>
                <LocaleLoadedGuard>
                    <PlashboardRoutes />
                </LocaleLoadedGuard>
            </BrowserRouter>
        </Provider>
    );
};

export default App;

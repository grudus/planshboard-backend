import React from "react";
import { BrowserRouter } from "react-router-dom";
import PlashboardRoutes from "./routing/PlanshboardRoutes";
import { Provider } from "react-redux";
import { planshboardStore } from "../store/configureStore";

const App: React.FunctionComponent<any> = () => {
    return (
        <Provider store={planshboardStore}>
            <BrowserRouter>
                <PlashboardRoutes />
            </BrowserRouter>
        </Provider>
    );
};

export default App;

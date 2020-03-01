import React from "react";
import { BrowserRouter } from "react-router-dom";
import PlashboardRoutes from "./routing/PlanshboardRoutes";

const App: React.FunctionComponent<any> = () => {
    return (
        <BrowserRouter>
            <PlashboardRoutes />
        </BrowserRouter>
    );
};

export default App;

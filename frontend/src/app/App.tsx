import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import PlashboardRoutes from "./routing/PlanshboardRoutes";
import { Provider } from "react-redux";
import { planshboardStore } from "../store/configureStore";

const App: React.FC = () => {
  return (
    <Provider store={planshboardStore}>
      <BrowserRouter>
        <LocalizedRoutes/>
      </BrowserRouter>
    </Provider>
  );
};

const LocalizedRoutes: React.FC = () => {
  useEffect(() => {
    // setTimeout(() => translations.setLanguage("en"), 1000);
  }, []);
  return (
    <PlashboardRoutes/>
  );
};

export default App;

import React from "react";
import { BrowserRouter } from "react-router-dom";
import PlashboardRoutes from "./routing/PlanshboardRoutes";

function App() {
  return (
    <BrowserRouter>
      <PlashboardRoutes/>
    </BrowserRouter>
  );
}

export default App;

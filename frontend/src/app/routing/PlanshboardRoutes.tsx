import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthRoutes from "../auth/AuthRoutes";
import BoardGameRoutes from "../board-games/BoardGameRoutes";
import { appRoutes } from "./routes";

const PlashboardRoutes = () => (
  <>
    <AuthRoutes/>
    <BoardGameRoutes/>
    <Route exact path={appRoutes.home}><Redirect to={appRoutes.boardGames.list}/></Route>
  </>
);

export default PlashboardRoutes;

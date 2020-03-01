import React from "react";
import { Route } from "react-router-dom";
import BoardGameList from "./BoardGameList";
import { appRoutes } from "../routing/routes";

const BoardGameRoutes = () => (
  <>
    <Route path={appRoutes.boardGames.list}><BoardGameList/></Route>
  </>
);

export default BoardGameRoutes;
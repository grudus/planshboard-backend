import { createAction } from "@reduxjs/toolkit";
import { Opponent } from "app/opponents/__models/OpponentModels";

export const getALlOpponentsSuccessAction = createAction<Opponent[]>("GET_ALL_OPPONENTS_SUCCESS");

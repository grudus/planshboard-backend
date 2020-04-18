import { createAction } from "@reduxjs/toolkit";
import { Opponent } from "app/opponents/__models/OpponentModels";

export const getAllOpponentsSuccessAction = createAction<Opponent[]>("GET_ALL_OPPONENTS_SUCCESS");
export const getSingleOpponentSuccessAction = createAction<Opponent>("GET_SINGLE_OPPONENT_SUCCESS");

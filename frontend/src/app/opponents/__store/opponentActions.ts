import { createAction } from "@reduxjs/toolkit";
import { OpponentListItem, OpponentWithStats, SaveOpponentRequest } from "app/opponents/__models/OpponentModels";

export const getAllOpponentsSuccessAction = createAction<OpponentListItem[]>("GET_ALL_OPPONENTS_SUCCESS");
export const getSingleOpponentSuccessAction = createAction<OpponentWithStats>("GET_SINGLE_OPPONENT_SUCCESS");
export const createOpponentSuccessAction = createAction<OpponentWithStats>("CREATE_OPPONENT_SUCCESS");
export const updateOpponentSuccessAction = createAction<SaveOpponentRequest>("UPDATE_OPPONENT_SUCCESS");

import { createAction } from "@reduxjs/toolkit";

export interface GetCurrentUserSuccessPayload {
    id: number;
    username: string;
}

export const getCurrentUserSuccessAction = createAction<GetCurrentUserSuccessPayload>("GET_USER_SUCCESS");

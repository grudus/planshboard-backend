import { ActionListener } from "store/listenForActionMiddleware";
import { httpRequestAction } from "app/shared/store/httpRequestActions";
import { PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "store/useAppDispatch";
import AuthActions from "app/auth/__store/authActions";

function handleHttpError(action: PayloadAction<Response | string>, dispatch: AppDispatch) {
    if (typeof action.payload === "string") {
        try {
            const body = JSON.parse(action.payload);
            if (body?.code === "FORBIDDEN" || body?.status === 403) dispatch(AuthActions.logout());
        } catch (e) {}
    }
}

export const HttpErrorListener: ActionListener = [httpRequestAction.rejected.type, handleHttpError];

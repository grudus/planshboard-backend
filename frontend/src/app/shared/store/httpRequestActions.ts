import { createAction } from "@reduxjs/toolkit";
import { useAwaitDispatch, WaitPayload } from "app/shared/store/useAwaitDispatch";

export interface HttpRequestPayload {
    path: string;
    type: "post" | "get" | "put" | "delete";
    body?: any;
    isForm?: boolean;
}

export interface ProxyPayload {
    successAction?: Function;
    errorAction?: Function;
}

export interface WaitHttpRequestPayload extends HttpRequestPayload, WaitPayload, ProxyPayload {}

export const httpRequestAction = createAction<WaitHttpRequestPayload>("HTTP_REQUEST");
export const httpErrorAction = createAction<Error>("HTTP_REQUEST_ERROR");
export const httpSuccessAction = createAction<Response | any>("HTTP_REQUEST_SUCCESS");

export function useHttpDispatch(): (request: HttpRequestPayload) => Promise<any> {
    const dispatch = useAwaitDispatch();

    return (request: HttpRequestPayload) => dispatch(request, httpRequestAction);
}
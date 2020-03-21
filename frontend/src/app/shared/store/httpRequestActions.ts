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
export const httpErrorAction = createAction<Response>("HTTP_REQUEST_ERROR");
export const httpSuccessAction = createAction<Response | any>("HTTP_REQUEST_SUCCESS");

export type HttpDispatch = (request: HttpRequestPayload | (HttpRequestPayload & ProxyPayload)) => Promise<any>;
export function useHttpDispatch(): HttpDispatch {
    const dispatch = useAwaitDispatch();

    return (request: HttpRequestPayload) => dispatch(request, httpRequestAction);
}

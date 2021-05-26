import { AsyncThunk, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WaitPayload } from "app/shared/store/useAwaitDispatch";
import { Store } from "store/rootReducer";
import { fetchJson, postFormRequest } from "utils/httpUtils";

export interface HttpRequestPayload<REQ = any> {
    path: string;
    type: "post" | "get" | "put" | "delete";
    body?: REQ;
    isForm?: boolean;
}

export type ApiCall<REQ = any> = (req: REQ) => HttpRequestPayload<REQ>;

export interface ProxyPayload {
    // eslint-disable-next-line @typescript-eslint/ban-types
    successAction?: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    errorAction?: Function;
}

export interface WaitHttpRequestPayload extends HttpRequestPayload, WaitPayload, ProxyPayload {}

export const httpRequestAction = createAction<WaitHttpRequestPayload>("HTTP_REQUEST");
export const httpErrorAction = createAction<Response>("HTTP_REQUEST_ERROR");
export const httpSuccessAction = createAction<Response | any>("HTTP_REQUEST_SUCCESS");

export const httpRequestAction2 = createAsyncThunk(
    "HTTP_REQQQ",
    async (req: HttpRequestPayload, thunkAPI): Promise<any> => {
        const state = thunkAPI.getState() as Store;
        const token = state?.auth?.token;
        try {
            return req.isForm ? await postFormRequest(req, token) : await fetchJson(req, token);
        } catch (e) {
            const error = e instanceof Response ? await e.text() : e;
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const passBodyToResponse = (response: any, body: any) => body;

export const baseHttpAction = <Returned, Body = any, RawResponse = Returned>(
    type: string,
    payloadCreator: (body: Body) => HttpRequestPayload<Body>,
    responseMapper: (response: RawResponse, body: Body) => Returned = response => response as any,
): AsyncThunk<Returned, Body, any> => {
    return createAsyncThunk<Returned, Body, any>(type, async (arg, thunkAPI) => {
        try {
            const actionResponse = await thunkAPI.dispatch(httpRequestAction2(payloadCreator(arg)));
            if (actionResponse.meta.requestStatus === "rejected") {
                return thunkAPI.rejectWithValue(actionResponse);
            }
            return responseMapper(actionResponse.payload, arg);
        } catch (e) {
            throw thunkAPI.rejectWithValue(e);
        }
    });
};

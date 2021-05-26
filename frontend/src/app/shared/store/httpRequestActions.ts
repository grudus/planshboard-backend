import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { Store } from "store/rootReducer";
import { fetchJson, postFormRequest } from "utils/httpUtils";

export interface HttpRequestDefinition<BODY = any> {
    path: string;
    type: "post" | "get" | "put" | "delete";
    body?: BODY;
    isForm?: boolean;
}

export type ApiCall<BODY = any> = (body: BODY) => HttpRequestDefinition<BODY>;

export const httpRequestAction = createAsyncThunk(
    "HTTP_REQUEST",
    async (req: HttpRequestDefinition, thunkAPI): Promise<any> => {
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

export const passBodyAsResponse = (response: any, body: any) => body;

export function baseHttpAction<Returned, Body = any, RawResponse = Returned>(
    type: string,
    payloadCreator: (body: Body) => HttpRequestDefinition<Body>,
    responseMapper: (response: RawResponse, body: Body) => Returned = response => response as any,
): AsyncThunk<Returned, Body, any> {
    return createAsyncThunk<Returned, Body, any>(type, async (body, thunkAPI) => {
        try {
            const actionResponse = await thunkAPI.dispatch(httpRequestAction(payloadCreator(body)));
            if (actionResponse.meta.requestStatus === "rejected") {
                return thunkAPI.rejectWithValue(actionResponse);
            }
            return responseMapper(actionResponse.payload, body);
        } catch (e) {
            throw thunkAPI.rejectWithValue(e);
        }
    });
}

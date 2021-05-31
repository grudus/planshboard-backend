import { HttpRequestDefinition } from "app/shared/store/httpRequestActions";
import { JSONObject } from "utils/models/json";
import { PayloadAction } from "@reduxjs/toolkit";

export async function postFormRequest(request: HttpRequestDefinition, token?: string): Promise<Response | JSONObject> {
    const body = Object.keys(request.body)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(request.body[key]))
        .join("&");

    const response = await fetchRequest(
        { ...request, body },
        {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            Authorization: token ?? "",
        },
    );
    const text = await response.text();
    return text ? JSON.parse(text) : response;
}

export async function fetchJson(request: HttpRequestDefinition, token?: string): Promise<JSONObject> {
    const response = await fetchRequest(
        { ...request, body: JSON.stringify(request.body) },
        {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ?? "",
        },
    );
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function fetchRequest(request: HttpRequestDefinition, headers?: HeadersInit): Promise<Response> {
    const response = await fetch(normalizePath(request), {
        body: request.body,
        method: request.type,
        credentials: "include",
        headers,
    });
    if (response.status >= 400) {
        return Promise.reject(response);
    }
    return response;
}

export const getErrorCode = (error: string | PayloadAction): string | undefined => {
    const errorString = typeof error === "string" ? error : (error.payload as any);
    try {
        return JSON.parse(errorString)?.code;
    } catch (e) {
        console.error("Cannot parse error", error, e);
        return "UNKNOWN";
    }
};

function normalizePath(request: HttpRequestDefinition): string {
    if (request.path.startsWith("http")) return request.path;
    if (request.path.startsWith("/")) return process.env.REACT_APP_BACKEND_URL + request.path;
    return process.env.REACT_APP_BACKEND_URL + "/" + request.path;
}

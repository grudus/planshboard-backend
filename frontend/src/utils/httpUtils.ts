import { HttpRequestPayload } from "app/shared/store/httpRequestActions";

export function postFormRequest(request: HttpRequestPayload): Promise<Response | object> {
    const body = Object.keys(request.body)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(request.body[key]))
        .join("&");

    return fetchRequest(
        { ...request, body },
        {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
    );
}

export async function fetchRequest(request: HttpRequestPayload, headers?: HeadersInit): Promise<Response | object> {
    const response = await fetch(normalizePath(request), {
        body: request.body,
        method: request.type,
        credentials: "include",
        headers,
    });
    if (response.status >= 400) {
        return Promise.reject(response);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : response;
}

function normalizePath(request: HttpRequestPayload) {
    if (request.path.startsWith("http")) return request.path;
    if (request.path.startsWith("/")) return process.env.REACT_APP_BACKEND_URL + request.path;
    return process.env.REACT_APP_BACKEND_URL + "/" + request.path;
}

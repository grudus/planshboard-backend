import { Dispatch, Middleware, MiddlewareAPI } from "redux";

export function listenForActionsMiddleware(listeners: ActionListeners): Middleware {
    return (storeAPI: MiddlewareAPI) => (dispatch: Dispatch) => action => {
        if (listeners.has(action?.type)) {
            console.log("Listening for", action);
            const listener = listeners.get(action.type)!;
            listener(action);
        }

        dispatch(action);
    };
}

export type ActionListeners = Map<string, (action: any) => any>;

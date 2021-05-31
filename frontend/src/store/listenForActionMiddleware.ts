import { Dispatch, Middleware } from "redux";
import { PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "store/useAppDispatch";

export function listenForActionsMiddleware(listeners: ActionListeners): Middleware {
    return () => (dispatch: Dispatch) => action => {
        const result = dispatch(action);

        if (listeners.has(action?.type)) {
            const listener = listeners.get(action.type)!;
            listener(action, dispatch);
        }

        return result;
    };
}

type ActionType = string;
type ListenerFunc = (action: PayloadAction | any, dispatch: AppDispatch) => any;

export type ActionListeners = Map<ActionType, ListenerFunc>;
export type ActionListener = [ActionType, ListenerFunc];

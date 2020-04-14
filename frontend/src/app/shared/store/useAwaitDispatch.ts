import { useDispatch } from "react-redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useCallback } from "react";

export interface WaitPayload {
    resolve?: (t?: any) => void;
    reject?: (error: any) => void;
}

export type AwaitDispatch<T> = (request: T, action: ActionCreatorWithPayload<any>) => Promise<any>;
export function useAwaitDispatch<T>(): AwaitDispatch<T> {
    const dispatch = useDispatch();

    return useCallback(
        (request: T, action: ActionCreatorWithPayload<any>) =>
            new Promise<any>((resolve, reject) => {
                dispatch(action({ ...request, resolve, reject }));
            }),
        [dispatch],
    );
}

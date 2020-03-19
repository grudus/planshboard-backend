import { useDispatch } from "react-redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface WaitPayload {
    resolve?: (t?: any) => void;
    reject?: (error: any) => void;
}

export type AwaitDispatch<T> = (request: T, action: ActionCreatorWithPayload<T>) => Promise<any>;
export function useAwaitDispatch<T>(): AwaitDispatch<T> {
    const dispatch = useDispatch();

    return (request: T, action: ActionCreatorWithPayload<T>) =>
        new Promise<any>((resolve, reject) => {
            dispatch(action({ ...request, resolve, reject }));
        });
}

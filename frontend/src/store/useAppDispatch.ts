import { useDispatch } from "react-redux";
import { planshboardStore } from "store/configureStore";
import { unwrapResult } from "@reduxjs/toolkit";
import { useCallback } from "react";

export type AppDispatch = typeof planshboardStore.dispatch;

interface AppDispatchProps {
    swallowError?: boolean;
}

export const useAppDispatch = (props: AppDispatchProps = {}) => {
    const baseDispatch = useDispatch<AppDispatch>();
    const swallowError = props.swallowError || false;

    return useCallback(
        action => {
            const afterDispatch = swallowError ? Promise.resolve.bind(Promise) : unwrapResult;
            return baseDispatch(action)?.then?.(afterDispatch);
        },
        [baseDispatch, swallowError],
    );
};

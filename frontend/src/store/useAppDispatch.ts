import { useDispatch } from "react-redux";
import { planshboardStore } from "store/configureStore";
import { unwrapResult } from "@reduxjs/toolkit";
import { useCallback } from "react";

export type AppDispatch = typeof planshboardStore.dispatch;
export const useAppDispatch = () => {
    const baseDispatch = useDispatch<AppDispatch>();
    return useCallback(action => baseDispatch(action).then(unwrapResult), [baseDispatch]);
};

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

export const planshboardStore = configureStore({
    reducer: rootReducer,
});

/* eslint-disable import/prefer-default-export */
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducers";

export const store = configureStore({
  reducer: rootReducer,
});

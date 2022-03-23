import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../pages/Authentication/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});
export default rootReducer;

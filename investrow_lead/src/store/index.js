import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "../reducers";

/* const store = createStore(rootReducer, applyMiddleware(thunk)); */

/* export default store; */

// Create the Redux store with the reducer
export const store = configureStore({
  reducer: rootReducer,
});

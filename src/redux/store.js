import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth";
import {projectReducer} from "./slices/projects";

const store = configureStore({
  reducer: {
    projects: projectReducer,
    auth: authReducer,
  },
});

export default store;

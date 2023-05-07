import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./slices/auth";
import {projectReducer} from "./slices/projects";
import {notificationReducer} from "./slices/notifications"

const store = configureStore({
    reducer: {
        projects: projectReducer, auth: authReducer, notifications: notificationReducer
    },
});

export default store;

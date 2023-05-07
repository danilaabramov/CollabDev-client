import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchNotifications = createAsyncThunk("notifications", async (id) => {
    const {data} = await axios.get(`/notification?response_user_ids=${id}&notification_status_ids=1`);
    return data;
});

export const fetchUpdateNotifications = createAsyncThunk("notification/update", async ({id, status}) => {
    const {data} = await axios.patch(`/notification/${id}/`, {notification_status: status},{
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    });
    return data;
});

export const fetchPostNotifications = createAsyncThunk("notification/post", async ({id, text}) => {
    const {data} = await axios.post(`/notification/`, {project: id, text},{
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    });
    return data;
});

const initialState = {
    notifications: {
        items: null, status: "loading",
    }
};

const notificationsSlice = createSlice({
    name: "notifications", initialState, reducers: {
    }, extraReducers: {
        [fetchNotifications.fulfilled]: (state, action) => {
            state.notifications.items = action.payload.reverse();
            state.notifications.status = "loaded";
        }, [fetchNotifications.rejected]: (state) => {
            state.notifications.status = "error";
        },
        [fetchUpdateNotifications.fulfilled]: (state, action) => {
            let notifications = state.notifications.items
            state.notifications.items.map((item, index) => item.id === action.payload.notification_id ? notifications.splice(index, 1) : null)
            state.notifications.items = notifications
        },
    },
});

export const notificationReducer = notificationsSlice.reducer;
export const isNotificationsLoaded = ({notifications}) => notifications.notifications.status === "loaded"
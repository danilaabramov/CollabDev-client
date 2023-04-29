import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
    const {data} = await axios.post("/auth/login", params);
    return data;
});

export const fetchRegister = createAsyncThunk("auth/fetchRegister", async (params) => {
    const {data} = await axios.post("/auth/register", params);
    return data;
});

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
    const {data} = await axios.post("/auth/me", {
        refresh: window.localStorage.getItem("token_refresh")
    });
    return data;
});

const initialState = {
    data: null, status: "loading"
};

const authSlice = createSlice({
    name: "auth", initialState, reducers: {
        logout: (state) => {
            state.data = null;
            state.status = "loading"
        },
    }, extraReducers: {
        [fetchAuth.pending]: (state) => {
            state.status = "loading";
        }, [fetchAuth.fulfilled]: (state, action) => {
            state.status = "loaded";
            state.data = action.payload;
        }, [fetchAuth.rejected]: (state) => {
            state.status = "error";
            state.data = null;
        }, [fetchAuthMe.pending]: (state) => {
            state.status = "loading";
        }, [fetchAuthMe.fulfilled]: (state, action) => {
            state.status = "loaded";
            state.data = action.payload;
        }, [fetchAuthMe.rejected]: (state) => {
            state.status = "error";
            state.data = null;
        }, [fetchRegister.pending]: (state) => {
            state.status = "loading";
        }, [fetchRegister.fulfilled]: (state, action) => {
            state.status = "loaded";
            state.data = action.payload;
        }, [fetchRegister.rejected]: (state) => {
            state.status = "error";
            state.data = null;
        }
    },
});

export const isAuth = ({auth}) => Boolean(auth.data?.user);
export const isAuthError = ({auth}) => auth.status === "error"
export const authReducer = authSlice.reducer;
export const {logout} = authSlice.actions;

import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAllProjects = createAsyncThunk("projects", async () => {
    const {data} = await axios.get("/projects");
    return data;
});

export const fetchAllTypes = createAsyncThunk("type", async () => {
    const {data} = await axios.get("/type");
    return data;
});

export const fetchAllSkills = createAsyncThunk("skill", async () => {
    const {data} = await axios.get("/skill");
    return data;
});

export const fetchCreateProject = createAsyncThunk("project/create", async (params) => {
    const {data} = await axios.post("/projects/", params, {
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    });
    return data;
});

export const fetchOneProject = createAsyncThunk("one-project", async (id) => {
    const {data} = await axios.get(`/projects/${id}/`);
    return data;
});

export const fetchUpdateProject = createAsyncThunk("project/update", async (params) => {
    const {data} = await axios.put(`/projects/${params.id}/`, params, {
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    });
    return data;
});

export const fetchDeleteProject = createAsyncThunk("project/delete", async (id) => {
    const {data} = await axios.delete(`/projects/${id}/`, {
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    });
    return data;
});

export const fetchUserProjects = createAsyncThunk("user/projects", async (username) => {
    const {data} = await axios.get(`/user-details/${username}/`);
    return data;
});

export const fetchMeProjects = createAsyncThunk("me/projects", async (username) => {
    const {data} = await axios.get(`/user-details/${username}/`);
    return data;
});

const initialState = {
    projects: {
        items: null, status: "loading",
    }, types: {
        items: {}, status: "loading",
    }, skills: {
        items: [], status: "loading",
    }, meProjects: {
        items: null, status: "loading",
    }, customProject: {
        items: {}, status: "loading",
    }
};

const projectsSlice = createSlice({
    name: "projects", initialState, reducers: {
        clearCustomProject: ({customProject}) => customProject.items = {},
        clearProjects: (state) => {
            state.projects.items = []
            state.projects.status = "loading"
            state.meProjects.items = []
            state.meProjects.status = "loading"
        },
        deleteProject: (state, {payload}) => {
            const id = payload
            if (state.meProjects.items)
                for (let i = 0; i < state.meProjects.items.length; ++i)
                    if (state.meProjects.items[i].id === id)
                        state.meProjects.items.splice(i, 1)
            if (state.projects.items)
                for (let i = 0; i < state.projects.items.length; ++i)
                    if (state.projects.items[i].id === id)
                        state.projects.items.splice(i, 1)
        }
    }, extraReducers: {
        [fetchAllProjects.fulfilled]: (state, action) => {
            state.projects.items = action.payload.reverse();
            state.projects.status = "loaded";
        }, [fetchAllProjects.rejected]: (state) => {
            state.projects.status = "error";
        }, [fetchCreateProject.fulfilled]: (state, action) => {
            state.projects.items = [action.payload, ...state.projects.items];
            state.meProjects.items = [action.payload, ...state.meProjects.items];
        }, [fetchCreateProject.rejected]: (state) => {
            state.projects.status = "error";
        }, [fetchAllTypes.pending]: (state) => {
            state.types.status = "loading";
        }, [fetchAllTypes.fulfilled]: (state, action) => {
            state.types.items = action.payload
            state.types.status = "loaded";
        }, [fetchAllTypes.rejected]: (state) => {
            state.types.status = "error";
        }, [fetchAllSkills.pending]: (state) => {
            state.skills.status = "loading";
        }, [fetchAllSkills.fulfilled]: (state, action) => {
            state.skills.items = action.payload
            state.skills.status = "loaded";
        }, [fetchAllSkills.rejected]: (state) => {
            state.skills.status = "error";
        }, [fetchMeProjects.fulfilled]: (state, action) => {
            state.meProjects.items = action.payload.projects.reverse()
            state.meProjects.status = "loaded";
        }, [fetchMeProjects.rejected]: (state) => {
            state.meProjects.status = "error";
        }, [fetchDeleteProject.fulfilled]: (state, action) => {

        }, [fetchUpdateProject.fulfilled]: (state, action) => {
            console.log(action)
            state.customProject.items = action.payload
            let i = state.projects.items.map((item, index) => item.id === action.payload.id ? index : false)
                .filter(item => item !== false);
            if (i.length) state.projects.items[i[0]] = action.payload
            i = state.meProjects.items.map((item, index) => item.id === action.payload.id ? index : false)
                .filter(item => item !== false);
            if (i.length) state.meProjects.items[i[0]] = action.payload
        }
    },
});

export const projectReducer = projectsSlice.reducer;
export const isProjectsLoaded = ({projects}) => projects.projects.status === "loaded"
export const isTypesLoaded = ({projects}) => projects.types.status === "loaded"
export const isSkillsLoaded = ({projects}) => projects.skills.status === "loaded"
export const isMeProjectsLoaded = ({projects}) => projects.meProjects.status === "loaded"
export const isCustomProject = ({projects}) => Boolean(projects.customProject.items?.id)
export const {clearCustomProject, clearProjects, deleteProject} = projectsSlice.actions;

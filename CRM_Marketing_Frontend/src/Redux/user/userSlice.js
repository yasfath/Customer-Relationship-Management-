import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    isAuthenticated: false,
    role: null,
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.isAuthenticated = false;
            state.role = null;
            state.error = action.payload;
        },
        signOutStart: (state) => {
            state.loading = true;
        },
        signOutSuccess: (state, action) => {
            return initialState;
        },
        signOutFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Adding a generic update for profile changes
        updateUser: (state, action) => {
            state.currentUser = { ...state.currentUser, ...action.payload };
        }
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure,
    updateUser
} = userSlice.actions;

export default userSlice.reducer;

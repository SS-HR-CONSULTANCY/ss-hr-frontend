import { createSlice } from "@reduxjs/toolkit";
import type { appSliceInitialState } from "@/types/appSliceTypes";

const initialState: appSliceInitialState = {
    theme: "light"
}

const appSlice = createSlice({
    name: "appSlice",
    initialState: initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
    }
});

export const {toggleTheme, setTheme } = appSlice.actions;
export default appSlice.reducer;
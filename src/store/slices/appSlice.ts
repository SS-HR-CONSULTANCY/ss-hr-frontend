import { createSlice } from "@reduxjs/toolkit";
import type { appSliceInitialState } from "@/types/slice/appSliceTypes";

const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light";

const initialState: appSliceInitialState = {
    theme: savedTheme,
    sidebarOpen: false,
}

const appSlice = createSlice({
    name: "appSlice",
    initialState: initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
            localStorage.setItem("theme", state.theme);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem("theme", state.theme);
        },
        toggleAdminSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
    }
});

export const { toggleTheme, setTheme, toggleAdminSidebar } = appSlice.actions;
export default appSlice.reducer;
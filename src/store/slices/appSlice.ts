import { createSlice } from "@reduxjs/toolkit";
import type { appSliceInitialState } from "@/types/slice/appSliceTypes";



const initialState: appSliceInitialState = {
  theme: "dark",
  sidebarOpen: false,
};

const appSlice = createSlice({
  name: "appSlice",
  initialState: initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = "dark";
      localStorage.setItem("theme", "dark");
    },
    setTheme: (state) => {
      state.theme = "dark";
      localStorage.setItem("theme", "dark");
    },
    toggleAdminSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { toggleTheme, setTheme, toggleAdminSidebar } = appSlice.actions;
export default appSlice.reducer;

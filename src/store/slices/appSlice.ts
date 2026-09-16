import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { appSliceInitialState } from "@/types/slice/appSliceTypes";
import { REHYDRATE } from "redux-persist";

// Default to light theme and reset any stale dark setting from previous development sessions
const savedTheme = localStorage.getItem("theme");
const initialTheme: "light" | "dark" = savedTheme === "light" ? "light" : "light";
localStorage.setItem("theme", initialTheme);

const initialState: appSliceInitialState = {
  theme: initialTheme,
  sidebarOpen: false,
};

const appSlice = createSlice({
  name: "appSlice",
  initialState: initialState,
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      state.theme = nextTheme;
      localStorage.setItem("theme", nextTheme);
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    toggleAdminSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: any) => {
      // If legacy persisted state was dark, migrate it to light
      if (action.payload?.app?.theme === "dark") {
        state.theme = "light";
        localStorage.setItem("theme", "light");
      }
    });
  },
});

export const { toggleTheme, setTheme, toggleAdminSidebar } = appSlice.actions;
export default appSlice.reducer;

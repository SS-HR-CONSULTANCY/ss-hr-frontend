import { createSlice } from "@reduxjs/toolkit";
import type { adminSliceIntialState } from "@/types/slice/adminSliceTypes";

const initialState: adminSliceIntialState = {
    reportData: null
}

const adminSlice = createSlice({
    name: "adminSlice",
    initialState: initialState,
    reducers: {
        saveReportData: (state, action) => {
            state.reportData = action.payload;
        },
    }
});

export const { saveReportData } = adminSlice.actions;
export default adminSlice.reducer;
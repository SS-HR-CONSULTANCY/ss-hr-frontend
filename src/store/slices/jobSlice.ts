import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface JobState {
  isAddJobFormOpen: boolean;
  isEditJobFormOpen: boolean;
  selectedJobId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: JobState = {
  isAddJobFormOpen: false,
  isEditJobFormOpen: false,
  selectedJobId: null,
  isLoading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    toggleAddJobForm: (state) => {
      state.isAddJobFormOpen = !state.isAddJobFormOpen;
      if (!state.isAddJobFormOpen) {
        state.selectedJobId = null;
      }
    },
    openAddJobForm: (state) => {
      state.isAddJobFormOpen = true;
    },
    closeAddJobForm: (state) => {
      state.isAddJobFormOpen = false;
      state.selectedJobId = null;
    },

    // Edit Job Form
    toggleEditJobForm: (state, action: PayloadAction<string | null>) => {
      state.isEditJobFormOpen = !state.isEditJobFormOpen;
      state.selectedJobId = action.payload;
      if (!state.isEditJobFormOpen) {
        state.selectedJobId = null;
      }
    },
    openEditJobForm: (state, action: PayloadAction<string>) => {
      state.isEditJobFormOpen = true;
      state.selectedJobId = action.payload;
    },
    closeEditJobForm: (state) => {
      state.isEditJobFormOpen = false;
      state.selectedJobId = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetJobSlice: () => initialState,
  },
});

export const {
  toggleAddJobForm,
  openAddJobForm,
  closeAddJobForm,
  toggleEditJobForm,
  openEditJobForm,
  closeEditJobForm,
  setLoading,
  setError,
  resetJobSlice,
} = jobSlice.actions;

export default jobSlice.reducer;

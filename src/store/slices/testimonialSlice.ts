import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TestimonialSliceState } from "@/types/slice/testimonialSliceTypes";

const initialState: TestimonialSliceState = {
  isAddTestimonialFormOpen: false,
  isEditTestimonialFormOpen: false,
  isViewTestimonialDetailsOpen: false,
  selectedTestimonialId: null,
};

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {
    toggleAddTestimonialForm: (state) => {
      state.isAddTestimonialFormOpen = !state.isAddTestimonialFormOpen;
    },
    openEditTestimonialForm: (state, action: PayloadAction<string>) => {
      state.isEditTestimonialFormOpen = true;
      state.selectedTestimonialId = action.payload;
    },
    closeEditTestimonialForm: (state) => {
      state.isEditTestimonialFormOpen = false;
      state.selectedTestimonialId = null;
    },
    openViewTestimonialDetails: (state, action: PayloadAction<string>) => {
      state.isViewTestimonialDetailsOpen = true;
      state.selectedTestimonialId = action.payload;
    },
    closeViewTestimonialDetails: (state) => {
      state.isViewTestimonialDetailsOpen = false;
      state.selectedTestimonialId = null;
    },
    closeAllTestimonialModals: (state) => {
      state.isAddTestimonialFormOpen = false;
      state.isEditTestimonialFormOpen = false;
      state.isViewTestimonialDetailsOpen = false;
      state.selectedTestimonialId = null;
    },
  },
});

export const {
  toggleAddTestimonialForm,
  openEditTestimonialForm,
  closeEditTestimonialForm,
  openViewTestimonialDetails,
  closeViewTestimonialDetails,
  closeAllTestimonialModals,
} = testimonialSlice.actions;

export default testimonialSlice.reducer;

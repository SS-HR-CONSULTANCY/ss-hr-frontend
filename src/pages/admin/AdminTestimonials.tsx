import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllTestimonials } from "@/utils/apis/adminTestimonialApi";
import {
  toggleAddTestimonialForm,
  closeAllTestimonialModals,
} from "@/store/slices/testimonialSlice";
import type { AdminfetchAllTestimonialsResponse } from "@/types/apiTypes/adminApiTypes";
import CommonTable from "@/components/common/CommonTable";
import { TestimonialTableColumns } from "@/components/table/tableColumns/TestimonialTableColumns";
import AddTestimonialForm from "@/components/admin/AddTestimonialForm";
import EditTestimonialForm from "@/components/admin/EditTestimonialForm";
import TestimonialDetails from "@/components/admin/TestimonialDetails";

const AdminTestimonials: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isAddTestimonialFormOpen,
    isEditTestimonialFormOpen,
    isViewTestimonialDetailsOpen,
  } = useSelector((state: RootState) => state.testimonial);

  const handleCloseModals = () => {
    dispatch(closeAllTestimonialModals());
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Testimonials
          </h1>
          <p className="text-sm font-normal text-gray-400">
            Client testimonials about our HR consultancy services
          </p>
        </div>
        <Button
          onClick={() => dispatch(toggleAddTestimonialForm())}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Testimonial
        </Button>
      </div>

      {/* Testimonials Table */}
      <CommonTable<AdminfetchAllTestimonialsResponse>
        fetchApiFunction={getAllTestimonials}
        queryKey="testimonials"
        heading=""
        description=""
        column={TestimonialTableColumns}
        columnsCount={7}
        showDummyData={false}
        pageSize={10}
      />

      {/* Add Testimonial Modal */}
      {isAddTestimonialFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddTestimonialForm />
          </div>
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {isEditTestimonialFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <EditTestimonialForm />
          </div>
        </div>
      )}

      {/* View Testimonial Details Modal - Temporarily disabled until TestimonialDetails component is created */}
      {isViewTestimonialDetailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          {isViewTestimonialDetailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TestimonialDetails />
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;

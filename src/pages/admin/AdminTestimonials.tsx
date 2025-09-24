import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "@/components/common/CommonTable";
import type { AppDispatch, RootState } from "@/store/store";
import TablePageHeader from "@/components/common/TablePageHeader";
import { getAllTestimonials } from "@/utils/apis/adminTestimonialApi";
import AddTestimonialForm from "@/components/admin/AddTestimonialForm";
import TestimonialDetails from "@/components/admin/TestimonialDetails";
import EditTestimonialForm from "@/components/admin/EditTestimonialForm";
import { toggleAddTestimonialForm } from "@/store/slices/testimonialSlice";
import type { AdminfetchAllTestimonialsResponse } from "@/types/apiTypes/adminApiTypes";
import { TestimonialTableColumns } from "@/components/table/tableColumns/TestimonialTableColumns";

const AdminTestimonials: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isAddTestimonialFormOpen,
    isEditTestimonialFormOpen,
    isViewTestimonialDetailsOpen,
  } = useSelector((state: RootState) => state.testimonial);

  return (
    <>
      <TablePageHeader
        title="Testimonials"
        subtitle="Client testimonials about our HR consultancy services"
        actionButton={
          <Button
            onClick={() => dispatch(toggleAddTestimonialForm())}
            variant="outline"
          >
            <Plus className="h-5 w-5" />
            Add New Testimonial
          </Button>
        }
      />

      {/* Testimonials Table */}
      <CommonTable<AdminfetchAllTestimonialsResponse>
        fetchApiFunction={getAllTestimonials}
        queryKey="testimonials"
        heading=""
        description=""
        column={TestimonialTableColumns}
        columnsCount={6}
        showDummyData={false}
        pageSize={10}
      />

      {/* Add Testimonial Modal */}
      {isAddTestimonialFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddTestimonialForm />
          </div>
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {isEditTestimonialFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <EditTestimonialForm />
          </div>
        </div>
      )}

      {/* View Testimonial Details Modal - Temporarily disabled until TestimonialDetails component is created */}
      {isViewTestimonialDetailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          {isViewTestimonialDetailsOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <TestimonialDetails />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminTestimonials;

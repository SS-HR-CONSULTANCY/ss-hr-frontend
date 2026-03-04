import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "@/components/common/CommonTable";
import type { AppDispatch, RootState } from "@/store/store";
import TablePageHeader from "@/components/common/TablePageHeader";
import { useAdminTestimonials } from "@/hooks/useAdminTestimonials";
import { getAllTestimonials } from "@/utils/apis/adminTestimonialApi";
import { toggleAddTestimonialForm } from "@/store/slices/testimonialSlice";
import type { AdminfetchAllTestimonialsResponse } from "@/types/apiTypes/adminApiTypes";
import AddTestimonialForm from "@/components/admin/adminTestimonial/AddTestimonialForm";
import TestimonialDetails from "@/components/admin/adminTestimonial/TestimonialDetails";
import { AdminTestimonialTableColumns } from "@/components/table/tableColumns/AdminTestimonialTableColumns";
import EditTestimonialForm from "@/components/admin/adminTestimonial/EditTestimonialForm";

const AdminTestimonials: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    handleDeleteTestimonial,
    handleEditTestimonial,
    handleViewTestimonial,
    isDeleting,
  } = useAdminTestimonials();

  const column = AdminTestimonialTableColumns(
    handleDeleteTestimonial,
    handleEditTestimonial,
    handleViewTestimonial,
    isDeleting,
  );

  const {
    isAddTestimonialFormOpen,
    isEditTestimonialFormOpen,
    isViewTestimonialDetailsOpen,
  } = useSelector((state: RootState) => state.testimonial);

  return (
    <>
      <TablePageHeader
        title="Reviews"
        subtitle="Client reviews about our HR consultancy services"
        actionButton={
          <Button
            onClick={() => dispatch(toggleAddTestimonialForm())}
            variant="outline"
          >
            <Plus className="h-5 w-5" />
            Add New Review
          </Button>
        }
      />

      <CommonTable<AdminfetchAllTestimonialsResponse>
        fetchApiFunction={getAllTestimonials}
        queryKey="testimonials"
        heading=""
        description=""
        column={column}
        columnsCount={6}
        pageSize={10}
      />

      {(isAddTestimonialFormOpen ||
        isEditTestimonialFormOpen ||
        isViewTestimonialDetailsOpen) && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {isAddTestimonialFormOpen && <AddTestimonialForm />}
            {isEditTestimonialFormOpen && <EditTestimonialForm />}
            {isViewTestimonialDetailsOpen && <TestimonialDetails />}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTestimonials;

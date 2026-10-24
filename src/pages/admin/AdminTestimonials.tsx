import React from "react";
import { Plus, RefreshCw } from "lucide-react";
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
    handleSyncGoogleReviews,
    isDeleting,
    isSyncing,
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
        title="Google Reviews"
        subtitle="Manage customer Google reviews dynamically reflected on the user website"
        actionButton={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSyncGoogleReviews}
              disabled={isSyncing}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              <RefreshCw
                className={`h-4 w-4 mr-1.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? "Syncing..." : "Sync from Google"}
            </Button>
            <Button
              onClick={() => dispatch(toggleAddTestimonialForm())}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Google Review
            </Button>
          </div>
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

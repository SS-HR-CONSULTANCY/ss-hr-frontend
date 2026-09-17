import React from "react";
import FormLoading from "../../form/FormLoading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { closeViewEnquiryDetails } from "@/store/slices/enquirySlice";
import { adminFetchAllEnquiries, adminUpdateEnquiryStatus } from "@/utils/apis/adminEnquiryApi";
import { format } from "date-fns";
import { ENQUIRY_STATUS_CONFIG, getStatusConfig } from "@/utils/enquiryStatusConfig";

const EnquiryDetailsModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { selectedEnquiryId } = useSelector((state: RootState) => state.enquiry);

  // We fetch all enquiries and find the one we need. If we had a specific "getById" endpoint, we would use it here.
  // Using the list endpoint with a large limit or finding it from cache is an alternative.
  // Ideally, passing down the exact enquiry object is better, but since the slice only stores the ID, we'll extract it from the paginated cache.
  
  const handleClose = () => {
    dispatch(closeViewEnquiryDetails());
  };

  const { data: enquiriesData, isLoading } = useQuery({
    queryKey: ["adminEnquiries"],
    queryFn: () => adminFetchAllEnquiries({ pagination: { limit: 100, page: 1 } }), // simplified fetch
  });

  const selectedEnquiry = enquiriesData?.data?.find(e => e._id === selectedEnquiryId);

  const updateStatusMutation = useMutation({
    mutationFn: (status: "pending" | "contacted" | "need_follow_up" | "not_interested" | "processing_application" | "completed" | "rejected_application") => 
      adminUpdateEnquiryStatus({ enquiryId: selectedEnquiryId!, status }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Enquiry status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["adminEnquiries"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  const handleStatusChange = (value: string) => {
    updateStatusMutation.mutate(value as any);
  };

  if (!selectedEnquiryId) return null;

  if (isLoading) return <FormLoading />;

  if (!selectedEnquiry) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg text-center">
          <p className="text-red-500 text-lg font-medium">Enquiry not found</p>
          <Button onClick={handleClose} className="mt-4" variant="outline">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border dark:border-slate-700 shadow-2xl">
        <div className="p-6 text-slate-900 dark:text-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold dark:text-gray-200">Enquiry Details</h2>
            <div className="flex items-center gap-2">
               <Select
                defaultValue={selectedEnquiry.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className={`w-[185px] h-8 text-xs font-semibold border ${getStatusConfig(selectedEnquiry.status).triggerClass}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ENQUIRY_STATUS_CONFIG).map(([value, c]) => (
                    <SelectItem key={value} value={value}>
                      <span className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${c.dotClass}`} />
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50">
                <h4 className="text-xs text-gray-500 font-semibold uppercase">Sender</h4>
                <p className="font-medium dark:text-gray-200">{selectedEnquiry.firstName} {selectedEnquiry.lastName}</p>
                <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-500 text-sm hover:underline">{selectedEnquiry.email}</a>
                {selectedEnquiry.phone && <p className="text-sm mt-1 dark:text-gray-300">{selectedEnquiry.phone}</p>}
              </div>

              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50">
                <h4 className="text-xs text-gray-500 font-semibold uppercase">Date</h4>
                <p className="font-medium dark:text-gray-200">{format(new Date(selectedEnquiry.createdAt), "PPP p")}</p>
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50">
              <h4 className="text-xs text-gray-500 font-semibold uppercase mb-1">Subject</h4>
              <p className="font-bold text-lg dark:text-gray-100">{selectedEnquiry.subject}</p>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <h4 className="text-xs text-gray-500 font-semibold uppercase mb-2">Message</h4>
              <p className="whitespace-pre-wrap text-sm leading-relaxed dark:text-gray-300">{selectedEnquiry.message}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6">
            <Button onClick={handleClose} variant="outline">Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetailsModal;

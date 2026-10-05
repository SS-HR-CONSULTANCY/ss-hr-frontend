import React, { useState } from "react";
import CommonTable from "@/components/common/CommonTable";
import { adminFetchAllPlatformLeads, adminUpdatePlatformLead, type ImportedCustomer } from "@/utils/apis/adminPlatformLeadsApi";
import { AdminPlatformLeadsTableColumns } from "@/components/table/tableColumns/AdminPlatformLeadsTableColumn";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const TelecallerLeads: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<ImportedCustomer | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // State for telecalling updates
  const [status, setStatus] = useState<string>("Pending");
  const [comment, setComment] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<string>("");

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: { status: string, comment: string, scheduledDate?: string, state?: string } }) => 
      adminUpdatePlatformLead(data.id, data.payload),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: ["admin-telecaller-leads"] });
      setSelectedCustomer(updatedCustomer);
      setIsSheetOpen(false);
    },
    onError: () => {
      toast.error("Failed to update lead");
    }
  });

  const handleView = (customer: ImportedCustomer) => {
    setSelectedCustomer(customer);
    setStatus(customer.status || "Pending");
    setComment(customer.comment || "");
    setScheduledDate(customer.scheduledDate ? new Date(customer.scheduledDate).toISOString().split('T')[0] : "");
    setIsSheetOpen(true);
  };

  const handleInlineStatusUpdate = (id: string, newStatus: string, existingComment: string, scheduledDate?: string, state?: string) => {
    updateMutation.mutate({
      id,
      payload: { status: newStatus, comment: existingComment, scheduledDate, state }
    });
  };

  const handleUpdateLead = () => {
    if (!selectedCustomer) return;
    updateMutation.mutate({
      id: selectedCustomer._id,
      payload: { status, comment, scheduledDate }
    });
  };

  const columns = AdminPlatformLeadsTableColumns(handleView, handleInlineStatusUpdate);

  const fetchTodayLeads = (params?: any) => {
    const today = new Date().toISOString().split('T')[0];
    return adminFetchAllPlatformLeads({
      ...params,
      pagination: {
        ...params?.pagination,
        scheduledDate: today
      }
    });
  };

  return (
    <div>
      <CommonTable<ImportedCustomer>
        fetchApiFunction={fetchTodayLeads}
        queryKey="admin-telecaller-leads"
        heading="Today's Scheduled Leads"
        description="Clients scheduled to be contacted today"
        column={columns}
        columnsCount={9}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:w-1/3 sm:max-w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Customer Details</SheetTitle>
            <SheetDescription>
              Full details for {selectedCustomer?.name}
            </SheetDescription>
          </SheetHeader>
          
          {selectedCustomer && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                  <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                  <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">State</h4>
                  <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.state || "N/A"}</p>
                </div>
                {selectedCustomer.linkedinUrl && (
                  <div className="col-span-2 mt-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">LinkedIn</h4>
                    <a 
                      href={selectedCustomer.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      {selectedCustomer.linkedinUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Telecalling Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <h4 className="text-[15px] font-semibold text-blue-900 dark:text-blue-100 mb-3">Telecalling Updates</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Converted">Converted</option>
                      <option value="Not Interested">Not Interested</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agent Comments</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Enter follow up notes..."
                      className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule Date</label>
                    <input 
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>

                  <button 
                    onClick={handleUpdateLead}
                    disabled={updateMutation.isPending}
                    className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Updates"}
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 mb-3">Designations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.designations?.length ? (
                    selectedCustomer.designations.map((d, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                        {d}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Resume View</h4>
                  {selectedCustomer.cvUrl && (
                    <a
                      href={selectedCustomer.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1 font-medium bg-primary/10 px-3 py-1 rounded-full"
                    >
                      Open directly <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  )}
                </div>
                {selectedCustomer.cvUrl ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-1">
                    <iframe 
                      src={selectedCustomer.cvUrl.includes('drive.google.com') ? selectedCustomer.cvUrl.replace(/\/view(\?.*)?$/, '/preview$1') : selectedCustomer.cvUrl} 
                      className="w-full h-[600px] rounded-lg bg-white"
                      title="Resume Viewer"
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
                    <p className="text-gray-500 font-medium">No resume available for this user.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TelecallerLeads;

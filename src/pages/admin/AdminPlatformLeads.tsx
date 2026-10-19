import React, { useState } from "react";
import CommonTable from "@/components/common/CommonTable";
import { 
  adminFetchAllPlatformLeads, 
  adminUpdatePlatformLead, 
  adminAssignPlatformLead,
  adminFetchSystemStaff,
  adminSummarizeLeadComment,
  type ImportedCustomer,
  type AssignedStaff
} from "@/utils/apis/adminPlatformLeadsApi";
import { AdminPlatformLeadsTableColumns, buildWhatsAppUrl, formatPhoneWithCountryCode } from "@/components/table/tableColumns/AdminPlatformLeadsTableColumn";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Copy, Sparkles, Loader2, Undo2 } from "lucide-react";
import { isNewPlatformLead } from "@/utils/helpers/followUp";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { IconBrandWhatsapp } from "@tabler/icons-react";

const AdminPlatformLeads: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCustomer, setSelectedCustomer] = useState<ImportedCustomer | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // State for telecalling updates
  const [status, setStatus] = useState<string>("Pending");
  const [comment, setComment] = useState<string>("");
  const [previousComment, setPreviousComment] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<string>("");

  const queryClient = useQueryClient();

  const { data: staffList = [] } = useQuery<AssignedStaff[]>({
    queryKey: ["adminStaffList"],
    queryFn: adminFetchSystemStaff,
  });

  const assignMutation = useMutation({
    mutationFn: (data: { id: string; staffId: string | null }) =>
      adminAssignPlatformLead(data.id, data.staffId),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: ["admin-platform-leads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-telecaller-leads"] });
      const staffName = typeof updatedCustomer.assignedTo === "object" && updatedCustomer.assignedTo
        ? updatedCustomer.assignedTo.fullName || updatedCustomer.assignedTo.username
        : "staff";
      toast.success(updatedCustomer.assignedTo ? `Contact assigned to ${staffName}` : "Contact unassigned");
    },
    onError: () => {
      toast.error("Failed to assign staff");
    },
  });

  const handleAssignStaff = (id: string, staffId: string | null) => {
    assignMutation.mutate({ id, staffId });
  };

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: { status: string, comment: string, scheduledDate?: string, state?: string, assignedTo?: string | null } }) => 
      adminUpdatePlatformLead(data.id, data.payload),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: ["admin-platform-leads"] });
      setSelectedCustomer(updatedCustomer);
      setIsSheetOpen(false);
    },
    onError: () => {
      toast.error("Failed to update lead");
    }
  });

  const handleSummarizeComment = async () => {
    if (!comment || !comment.trim()) {
      toast.info("Please paste or type the conversation text in the comment box first.");
      return;
    }
    try {
      setIsSummarizing(true);
      const originalText = comment;
      const summary = await adminSummarizeLeadComment(originalText);
      setPreviousComment(originalText);
      setComment(summary);
      toast.success("Conversation summarized with AI!");
    } catch (err: any) {
      console.error("AI summarize error:", err);
      toast.error(err.message || "Failed to summarize conversation with AI.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleView = (customer: ImportedCustomer) => {
    setSelectedCustomer(customer);
    setStatus(customer.status || "Pending");
    setComment(customer.comment || "");
    setPreviousComment("");
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

  const columns = AdminPlatformLeadsTableColumns(
    handleView,
    handleInlineStatusUpdate,
    {
      hideEmail: true,
      staffList,
      onAssignStaff: handleAssignStaff,
      isAdmin: true,
      staffName: user?.fullName || user?.username || "",
    }
  );

  return (
    <div>
      <CommonTable<ImportedCustomer>
        fetchApiFunction={adminFetchAllPlatformLeads}
        queryKey="admin-platform-leads"
        heading="Platform Leads"
        description=""
        column={columns}
        columnsCount={9}
        showSearchInput={true}
        searchPlaceholder="Search name, email, phone, state..."
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
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedCustomer.name}</p>
                    {isNewPlatformLead(selectedCustomer) && (
                      <span className="inline-flex items-center px-1 py-0 rounded text-[7px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 tracking-tight uppercase shrink-0 leading-tight">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                  {selectedCustomer.email ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <a
                        href={`mailto:${selectedCustomer.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline break-all font-medium text-sm"
                      >
                        {selectedCustomer.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedCustomer.email);
                          toast.success("Email copied to clipboard");
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-gray-500 hover:text-gray-700 transition-colors"
                        title="Copy email"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">N/A</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                  {selectedCustomer.phone ? (
                    <a
                      href={buildWhatsAppUrl(
                        selectedCustomer.phone,
                        selectedCustomer.name,
                        user?.fullName || user?.username || ""
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2 py-1 -ml-2 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 transition-colors font-medium text-sm group"
                      title={`Send WhatsApp message to ${selectedCustomer.name || selectedCustomer.phone}`}
                    >
                      <IconBrandWhatsapp size={16} className="text-[#25D366] shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="underline-offset-2 hover:underline">
                        {formatPhoneWithCountryCode(selectedCustomer.phone)}
                      </span>
                    </a>
                  ) : (
                    <p className="text-gray-400 text-sm">N/A</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">State</h4>
                  <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.state || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Assign Staff</h4>
                  <select
                    value={
                      selectedCustomer.assignedTo
                        ? typeof selectedCustomer.assignedTo === "object"
                          ? selectedCustomer.assignedTo._id
                          : selectedCustomer.assignedTo
                        : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value || null;
                      handleAssignStaff(selectedCustomer._id, val);
                      const matching = staffList.find(s => s._id === val) || null;
                      setSelectedCustomer(prev => prev ? ({ ...prev, assignedTo: matching }) : null);
                    }}
                    className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 font-medium"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.fullName || s.username}
                      </option>
                    ))}
                  </select>
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
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Agent Comments
                      </label>
                      <button
                        type="button"
                        onClick={handleSummarizeComment}
                        disabled={isSummarizing || !comment?.trim()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-xs hover:from-violet-700 hover:to-purple-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all cursor-pointer"
                        title="Paste full conversation in the comment box, then click to summarize with AI"
                      >
                        {isSummarizing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Summarizing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>AI Summarize</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Enter follow up notes, or paste full WhatsApp / call conversation to summarize..."
                        className="w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 dark:bg-gray-800 dark:border-gray-700 min-h-[90px] transition-all"
                      />
                    </div>
                    {previousComment && previousComment !== comment && (
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="text-gray-400 dark:text-gray-500 text-[11px]">Summarized with AI</span>
                        <button
                          type="button"
                          onClick={() => {
                            setComment(previousComment);
                            setPreviousComment("");
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium hover:underline cursor-pointer"
                        >
                          <Undo2 className="w-3 h-3" />
                          Undo AI summary
                        </button>
                      </div>
                    )}
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

export default AdminPlatformLeads;

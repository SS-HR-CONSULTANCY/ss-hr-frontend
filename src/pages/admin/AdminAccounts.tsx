import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Pencil, Trash2, Plus, X, Check, Users, ChevronDown, ChevronRight, MessageCircle, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminFetchAllAccounts,
  adminCreateAccount,
  adminUpdateAccount,
  adminDeleteAccount,
} from "@/utils/apis/adminAccountApi";
import { adminFetchAccountLeads } from "@/utils/apis/adminApi";

import type { AccountResponse } from "@/types/apiTypes/adminApiTypes";
import { format } from "date-fns";

const AdminAccounts: React.FC = () => {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminAccounts"],
    queryFn: adminFetchAllAccounts,
  });

  const accounts: AccountResponse[] = data?.data ?? [];

  const { data: leadsData, isLoading: isLeadsLoading } = useQuery({
    queryKey: ["accountLeads", expandedAccountId],
    queryFn: () => {
      const account = accounts.find((a) => a._id === expandedAccountId);
      if (!account) return Promise.resolve([]);
      return adminFetchAccountLeads(account.name);
    },
    enabled: !!expandedAccountId,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => adminCreateAccount(name),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Account created successfully");
        setNewName("");
        queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create account");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; name: string }) =>
      adminUpdateAccount(params.id, params.name),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Account updated successfully");
        setEditingId(null);
        queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update account");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteAccount(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Account deleted successfully");
        if (expandedAccountId === id) setExpandedAccountId(null);
        queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    },
  });

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return toast.error("Account name cannot be empty");
    createMutation.mutate(trimmed);
  };

  const handleStartEdit = (account: AccountResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(account._id);
    setEditingName(account.name);
  };

  const handleSaveEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const trimmed = editingName.trim();
    if (!trimmed) return toast.error("Account name cannot be empty");
    if (!editingId) return;
    updateMutation.mutate({ id: editingId, name: trimmed });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this account?")) {
      deleteMutation.mutate(id);
    }
  };

  const toggleExpand = (id: string) => {
    if (editingId === id) return;
    setExpandedAccountId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-2 sm:p-6 w-full max-w-7xl mx-auto">
      {/* Add new account */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Add New Account</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Enter staff / account name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1 max-w-md"
          />
          <Button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>

      {/* Accounts list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No accounts yet. Add your first account above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {accounts.map((account) => {
              const isExpanded = expandedAccountId === account._id;
              
              return (
                <li key={account._id} className="flex flex-col">
                  <div 
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/80' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    onClick={() => toggleExpand(account._id)}
                  >
                    <div className="text-slate-400 shrink-0">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    
                    {editingId === account._id ? (
                      <div className="flex-1 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="flex-1 h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleSaveEdit(e)}
                          disabled={updateMutation.isPending}
                          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(null)}
                          className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                          {account.name}
                          <span className="ml-2 text-xs text-slate-500 font-normal">
                            ({account.leadsCount || 0})
                          </span>
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleStartEdit(account, e)}
                          className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(account._id, e)}
                          disabled={deleteMutation.isPending}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* Expandable Leads Section */}
                  {isExpanded && (
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                        Assigned Leads
                      </h3>
                      
                      {isLeadsLoading ? (
                        <div className="text-sm text-slate-500 py-4">Loading leads...</div>
                      ) : !leadsData || leadsData.length === 0 ? (
                        <div className="text-sm text-slate-500 py-4 bg-white dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-700 text-center">
                          No enquiries assigned to this account yet.
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                          <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10">
                              <tr>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Source</th>
                                <th className="px-4 py-3 font-medium">Category</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {leadsData.map((lead) => {
                                return (
                                  <tr key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="font-medium text-slate-900 dark:text-slate-100">
                                        {lead.name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        {lead.source === 'WhatsApp' ? (
                                          <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                                        ) : (
                                          <Globe className="w-3.5 h-3.5 text-blue-500" />
                                        )}
                                        {lead.source}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        {lead.category}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminAccounts;

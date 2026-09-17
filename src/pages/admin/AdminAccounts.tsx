import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Pencil, Trash2, Plus, X, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminFetchAllAccounts,
  adminCreateAccount,
  adminUpdateAccount,
  adminDeleteAccount,
} from "@/utils/apis/adminAccountApi";
import type { AccountResponse } from "@/types/apiTypes/adminApiTypes";

const AdminAccounts: React.FC = () => {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminAccounts"],
    queryFn: adminFetchAllAccounts,
  });

  const accounts: AccountResponse[] = data?.data ?? [];

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

  const handleStartEdit = (account: AccountResponse) => {
    setEditingId(account._id);
    setEditingName(account.name);
  };

  const handleSaveEdit = () => {
    const trimmed = editingName.trim();
    if (!trimmed) return toast.error("Account name cannot be empty");
    if (!editingId) return;
    updateMutation.mutate({ id: editingId, name: trimmed });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-2 sm:p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Leads</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage staff accounts to track lead sources for enquiries
          </p>
        </div>
      </div>

      {/* Add new account */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Add New Account</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Enter staff / account name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1"
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
            {accounts.map((account) => (
              <li key={account._id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {editingId === account._id ? (
                  <>
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
                      onClick={handleSaveEdit}
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
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                      {account.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(account)}
                      className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(account._id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminAccounts;

import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import type { User as UserType } from "@/types/entities/user";
import { adminFetchUserById } from "@/utils/apis/adminUserApi";
import { closeUserDetailsModal } from "@/store/slices/userSlice";
import { User, Copy, CheckCircle, UserCheck, Loader } from "lucide-react";

const UserDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUserId } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserData();
    }
  }, [selectedUserId]);

  const fetchUserData = async () => {
    if (!selectedUserId) return;

    setLoading(true);
    try {
      const response = await adminFetchUserById(selectedUserId);
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUserId = async () => {
    if (!user) return;

    try {
      await navigator.clipboard.writeText(user._id.toString());
      setCopied(true);
      toast.success("User ID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy User ID");
    }
  };

  const handleClose = () => {
    dispatch(closeUserDetailsModal());
  };

  if (!selectedUserId) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-black">
          <div className="flex items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-black" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border ">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ">
              <UserCheck className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">User Not Found</h2>
            <p className="mb-6">The user you're looking for doesn't exist.</p>
            <Button
              onClick={handleClose}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border ">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black bg-white dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 brounded-full flex items-center justify-center border border-black">
                <UserCheck className="h-5 w-5 " />
              </div>
              <h3 className="text-xl font-bold ">User Details</h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto bg-white dark:bg-gray-700">
          <div className="p-6 space-y-4">
            {/* User Profile */}
            <div className="text-center pb-4 border-b">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 border border-black">
                <User className="h-10 w-10 " />
              </div>
              <h2 className="text-xl font-bold ">{user.fullName}</h2>
              <p className="text-sm">#{user.serialNumber}</p>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm">{user.email}</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Role</span>
                <span className="text-sm font-medium">{user.role}</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm font-medium">
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Verified</span>
                <span className="ext-sm font-medium">
                  {user.isVerified ? "Yes" : "No"}
                </span>
              </div>

              {user.phone && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Phone</span>
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">User ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">
                    {user._id.toString().slice(-8)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyUserId}
                    className="h-6 w-6 p-0 hover:bg-white"
                    title="Copy full User ID"
                  >
                    {copied ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-black" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t">
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

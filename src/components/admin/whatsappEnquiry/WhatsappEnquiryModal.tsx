import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminCreateWhatsappEnquiry, adminUpdateWhatsappEnquiry } from "@/utils/apis/adminWhatsappEnquiryApi";
import type { AdminFetchAllWhatsappEnquiriesResponse } from "@/types/apiTypes/adminApiTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface WhatsappEnquiryModalProps {
  enquiry?: AdminFetchAllWhatsappEnquiriesResponse | null;
  onClose: () => void;
}

const WhatsappEnquiryModal: React.FC<WhatsappEnquiryModalProps> = ({ enquiry, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = !!enquiry;

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    subject: "",
    status: "pending",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    if (enquiry) {
      setFormData({
        name: enquiry.name,
        contactNumber: enquiry.contactNumber,
        subject: enquiry.subject,
        status: enquiry.status,
        date: format(new Date(enquiry.date), "yyyy-MM-dd"),
      });
    }
  }, [enquiry]);

  const createMutation = useMutation({
    mutationFn: (data: any) => adminCreateWhatsappEnquiry(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Enquiry created successfully");
        queryClient.invalidateQueries({ queryKey: ["adminWhatsappEnquiries"] });
        onClose();
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create enquiry");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminUpdateWhatsappEnquiry(enquiry!._id, data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Enquiry updated successfully");
        queryClient.invalidateQueries({ queryKey: ["adminWhatsappEnquiries"] });
        onClose();
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update enquiry");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactNumber || !formData.subject || !formData.date) {
      toast.error("Please fill all required fields");
      return;
    }

    const cleanNumber = formData.contactNumber.replace(/[\s-]/g, '');
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    
    if (!phoneRegex.test(cleanNumber)) {
      toast.error("Please enter a valid phone number (10-15 digits, optional + prefix)");
      return;
    }

    if (cleanNumber.startsWith('+91') && cleanNumber.length !== 13) {
      toast.error("Indian phone numbers must be exactly 10 digits after the +91 code.");
      return;
    }

    const payload = {
      ...formData,
      date: new Date(formData.date).toISOString(),
    };

    if (isEditing) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border dark:border-slate-700 shadow-2xl">
        <div className="p-6 text-slate-900 dark:text-slate-100">
          <h2 className="text-xl font-bold dark:text-gray-200 mb-6">
            {isEditing ? "Edit WhatsApp Enquiry" : "Add WhatsApp Enquiry"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter client name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">WhatsApp Number <span className="text-red-500">*</span></Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="e.g. +971501234567"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief subject of enquiry"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="under_processing">Under Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEditing ? "Update Enquiry" : "Save Enquiry"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WhatsappEnquiryModal;

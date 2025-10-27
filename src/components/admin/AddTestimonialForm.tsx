import { toast } from "react-toastify";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AppDispatch } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { createTestimonial } from "@/utils/apis/adminTestimonialApi";
import { toggleAddTestimonialForm } from "@/store/slices/testimonialSlice";
import type { CreateTestimonialFormData } from "@/types/entities/testimonial";

const AddTestimonialForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateTestimonialFormData>({
    clientName: "",
    clientPhoto: null,
    designation: "",
    testimonial: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<CreateTestimonialFormData>>({});

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientPhoto: null,
      designation: "",
      testimonial: "",
    });
    setPreviewImage(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTestimonialFormData> = {};

    if (!formData.clientName?.trim()) {
      newErrors.clientName = "Client name is required";
    } else if (formData.clientName.length < 2) {
      newErrors.clientName = "Client name must be at least 2 characters";
    }

    if (!formData.designation?.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.testimonial?.trim()) {
      newErrors.testimonial = "Testimonial text is required";
    } else if (formData.testimonial.length < 20) {
      newErrors.testimonial = "Testimonial must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData({ ...formData, clientPhoto: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    dispatch(toggleAddTestimonialForm());
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = new FormData();
    submissionData.append("clientName", formData.clientName);
    submissionData.append("designation", formData.designation);
    submissionData.append("testimonial", formData.testimonial);
    if (formData.clientPhoto) {
      submissionData.append("clientPhoto", formData.clientPhoto);
    }

    const res = await createTestimonial(submissionData);
    if (res) {
      if (res.success) {
        toast.success(res.message);
        handleCancel();
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      }
    } else {
      toast.error("Testimonial adding failed");
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-sm border max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Add New Testimonial</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              placeholder="Enter client name"
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              placeholder="Enter designation"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhoto">Client Photo (Optional)</Label>
          <input
            type="file"
            id="clientPhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm border p-2"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimonial">Testimonial</Label>
          <Textarea
            id="testimonial"
            value={formData.testimonial}
            onChange={(e) =>
              setFormData({ ...formData, testimonial: e.target.value })
            }
            placeholder="Enter client testimonial..."
          />
          {errors.testimonial && (
            <p className="text-red-500 text-sm mt-1">{errors.testimonial}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="outline">
            Creating testimonial
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTestimonialForm;

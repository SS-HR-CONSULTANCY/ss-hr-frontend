import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AppDispatch } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTestimonial } from "@/utils/apis/adminTestimonialApi";
import { toggleAddTestimonialForm } from "@/store/slices/testimonialSlice";
import type { CreateTestimonialFormData } from "@/types/entities/testimonial";

const AddTestimonialForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateTestimonialFormData>({
    clientName: "",
    clientPhoto: "",
    designation: "",
    testimonial: "",
  });

  const [errors, setErrors] = useState<Partial<CreateTestimonialFormData>>({});

  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      toast.success("Testimonial created successfully");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      dispatch(toggleAddTestimonialForm());
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create testimonial");
    },
  });

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientPhoto: "",
      designation: "",
      testimonial: "",
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTestimonialFormData> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    } else if (formData.clientName.length < 2) {
      newErrors.clientName = "Client name must be at least 2 characters";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.testimonial.trim()) {
      newErrors.testimonial = "Testimonial text is required";
    } else if (formData.testimonial.length < 20) {
      newErrors.testimonial = "Testimonial must be at least 20 characters";
    }

    if (formData.clientPhoto && !isValidUrl(formData.clientPhoto)) {
      newErrors.clientPhoto = "Please enter a valid photo URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    dispatch(toggleAddTestimonialForm());
    resetForm();
  };

  return (
    <div className="p-6 rounded-lg shadow-sm border max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Add New Testimonial</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className=""
              placeholder="Enter client name"
            />
            {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation" className="">Designation</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className=""
              placeholder="Enter designation"
            />
            {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhoto" className="">Client Photo URL (Optional)</Label>
          <Input
            id="clientPhoto"
            value={formData.clientPhoto}
            onChange={(e) => setFormData({ ...formData, clientPhoto: e.target.value })}
            className=""
            placeholder="Enter photo URL"
          />
          {errors.clientPhoto && <p className="text-red-500 text-sm mt-1">{errors.clientPhoto}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimonial" className="">Testimonial</Label>
          <Textarea
            id="testimonial"
            value={formData.testimonial}
            onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
            className=""
            placeholder="Enter client testimonial about your HR consultancy services..."
          />
          {errors.testimonial && <p className="text-red-500 text-sm mt-1">{errors.testimonial}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outline"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Testimonial"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTestimonialForm;
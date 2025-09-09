// components/admin/EditTestimonialForm.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "radix-ui";
import type { RootState, AppDispatch } from "@/store/store";
import { closeEditTestimonialForm } from "@/store/slices/testimonialSlice";
import { getTestimonialById, updateTestimonial } from "@/utils/apis/testimonialApi";
import type { UpdateTestimonialFormData } from "@/types/entities/testimonial";

const EditTestimonialForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { selectedTestimonialId } = useSelector((state: RootState) => state.testimonial);

  const [formData, setFormData] = useState<UpdateTestimonialFormData>({
    clientName: "",
    clientPhoto: "",
    designation: "",
    testimonial: "",
    isVisible: true,
  });

  const [errors, setErrors] = useState<Partial<UpdateTestimonialFormData>>({});

  const { data: testimonialData, isLoading } = useQuery({
    queryKey: ["testimonial", selectedTestimonialId],
    queryFn: () => getTestimonialById(selectedTestimonialId!),
    enabled: !!selectedTestimonialId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateTestimonialFormData) => updateTestimonial(selectedTestimonialId!, data),
    onSuccess: () => {
      toast.success("Testimonial updated successfully");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      dispatch(closeEditTestimonialForm());
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update testimonial");
    },
  });

  useEffect(() => {
    if (testimonialData?.testimonial) {
      setFormData({
        clientName: testimonialData.testimonial.clientName,
        clientPhoto: testimonialData.testimonial.clientPhoto,
        designation: testimonialData.testimonial.designation,
        testimonial: testimonialData.testimonial.testimonial,
        isVisible: testimonialData.testimonial.isVisible,
      });
    }
  }, [testimonialData]);

  const isValidUrl = (string: string): boolean => {
    if (!string) return true; // Empty is valid for optional field
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateTestimonialFormData> = {};

    if (formData.clientName && formData.clientName.length < 2) {
      newErrors.clientName = "Client name must be at least 2 characters";
    }

    if (formData.testimonial && formData.testimonial.length < 20) {
      newErrors.testimonial = "Testimonial must be at least 20 characters";
    }

    if (formData.clientPhoto && !isValidUrl(formData.clientPhoto)) {
      newErrors.clientPhoto = "Please enter a valid photo URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    dispatch(closeEditTestimonialForm());
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-black mb-6">Edit Testimonial</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName" className="text-black">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="bg-white text-black border-gray-300"
              placeholder="Enter client name"
            />
            {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
          </div>

          <div>
            <Label htmlFor="designation" className="text-black">Designation</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="bg-white text-black border-gray-300"
              placeholder="Enter designation"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="clientPhoto" className="text-black">Client Photo URL</Label>
          <Input
            id="clientPhoto"
            value={formData.clientPhoto}
            onChange={(e) => setFormData({ ...formData, clientPhoto: e.target.value })}
            className="bg-white text-black border-gray-300"
            placeholder="Enter photo URL"
          />
          {errors.clientPhoto && <p className="text-red-500 text-sm mt-1">{errors.clientPhoto}</p>}
        </div>

        <div>
          <Label htmlFor="testimonial" className="text-black">Testimonial</Label>
          <Textarea
            id="testimonial"
            value={formData.testimonial}
            onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
            className="bg-white text-black border-gray-300 min-h-32"
            placeholder="Enter client testimonial..."
          />
          {errors.testimonial && <p className="text-red-500 text-sm mt-1">{errors.testimonial}</p>}
        </div>

        <div className="flex items-center">
          <label className="pr-[15px] text-[15px] leading-none text-black" htmlFor="isVisible">
            Make testimonial visible to public
          </label>
          <Switch.Root 
            className="relative h-[25px] w-[42px] cursor-default rounded-full bg-gray-300 shadow-[0_2px_10px] shadow-gray-400 outline-none focus:shadow-[0_0_0_2px] focus:shadow-blue-500 data-[state=checked]:bg-blue-600" 
            id="isVisible"
            checked={formData.isVisible}
            onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
            style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
          >
            <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-gray-400 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 text-black hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {updateMutation.isPending ? "Updating..." : "Update Testimonial"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTestimonialForm;
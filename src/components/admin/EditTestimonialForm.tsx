import { toast } from "react-toastify";
import FormLoading from "../form/FormLoading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as Switch from "@radix-ui/react-switch";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { closeEditTestimonialForm } from "@/store/slices/testimonialSlice";
import type { UpdateTestimonialFormData } from "@/types/entities/testimonial";
import {
  getTestimonialById,
  updateTestimonial,
} from "@/utils/apis/adminTestimonialApi";

const EditTestimonialForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { selectedTestimonialId } = useSelector(
    (state: RootState) => state.testimonial,
  );

  const [formData, setFormData] = useState<UpdateTestimonialFormData>({
    clientName: "",
    clientPhoto: null,
    designation: "",
    testimonial: "",
    isVisible: true,
  });

  const [errors, setErrors] = useState<Partial<UpdateTestimonialFormData>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: testimonialData, isLoading } = useQuery({
    queryKey: ["testimonial", selectedTestimonialId],
    queryFn: () => getTestimonialById(selectedTestimonialId!),
    enabled: !!selectedTestimonialId,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData({ ...formData, clientPhoto: file });
    setPreviewImage(URL.createObjectURL(file));
  };

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

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateTestimonialFormData> = {};

    if (formData.clientName && formData.clientName.length < 2) {
      newErrors.clientName = "Client name must be at least 2 characters";
    }

    if (formData.testimonial && formData.testimonial.length < 20) {
      newErrors.testimonial = "Testimonial must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    data.append("clientName", formData.clientName ?? "");
    data.append("designation", formData.designation ?? "");
    data.append("testimonial", formData.testimonial ?? "");
    data.append("isVisible", formData.isVisible ? "true" : "false");

    if (formData.clientPhoto instanceof File) {
      data.append("clientPhoto", formData.clientPhoto);
    }

    const res = await updateTestimonial({
      testimonialId: selectedTestimonialId!,
      testimonialData: data,
    });

    if (res) {
      if (res.success) {
        toast.success("Testimonial updated successfully");
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        dispatch(closeEditTestimonialForm());
      }
    } else {
      toast.error("Failed to update testimonial");
    }
  };

  const handleCancel = () => {
    dispatch(closeEditTestimonialForm());
  };

  if (isLoading) {
    return <FormLoading />;
  }

  return (
    <div className="p-6 rounded-lg shadow-sm border max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Edit Testimonial</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="">
              Client Name
            </Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              className=""
              placeholder="Enter client name"
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation" className="">
              Designation
            </Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              className=""
              placeholder="Enter designation"
            />
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
          <Label htmlFor="testimonial" className="">
            Testimonial
          </Label>
          <Textarea
            id="testimonial"
            value={formData.testimonial}
            onChange={(e) =>
              setFormData({ ...formData, testimonial: e.target.value })
            }
            className=""
            placeholder="Enter client testimonial..."
          />
          {errors.testimonial && (
            <p className="text-red-500 text-sm mt-1">{errors.testimonial}</p>
          )}
        </div>

        <div className="flex items-center">
          <label
            className="pr-[15px] text-[15px] leading-none"
            htmlFor="isVisible"
          >
            Make testimonial visible to public
          </label>
          <Switch.Root
            className="relative h-[25px] w-[42px] cursor-default rounded-full bg-gray-300 shadow-[0_2px_10px] shadow-gray-400 outline-none focus:shadow-[0_0_0_2px] focus:shadow-blue-500 data-[state=checked]:bg-blue-600"
            id="isVisible"
            checked={formData.isVisible}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isVisible: checked })
            }
          >
            <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-gray-400 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="outline">
            {"Update Testimonial"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTestimonialForm;

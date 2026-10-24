import { toast } from "react-toastify";
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
import FormLoading from "@/components/form/FormLoading";
import { Star } from "lucide-react";

const formatToLocalDateTimeInput = (dateInput?: string | Date) => {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const EditTestimonialForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { selectedTestimonialId } = useSelector(
    (state: RootState) => state.testimonial,
  );

  const [formData, setFormData] = useState<UpdateTestimonialFormData>({
    clientName: "",
    designation: "Google Reviewer",
    testimonial: "",
    rating: 5,
    reviewDate: "",
    isVisible: true,
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<UpdateTestimonialFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: testimonialData, isLoading } = useQuery({
    queryKey: ["testimonial", selectedTestimonialId],
    queryFn: () => getTestimonialById(selectedTestimonialId!),
    enabled: !!selectedTestimonialId,
  });

  useEffect(() => {
    if (testimonialData?.testimonial) {
      const t = testimonialData.testimonial;
      setFormData({
        clientName: t.clientName || "",
        designation: t.designation || "Google Reviewer",
        testimonial: t.testimonial || "",
        rating: t.rating ?? 5,
        reviewDate: formatToLocalDateTimeInput(t.reviewDate || t.createdAt),
        isVisible: t.isVisible ?? true,
      });
    }
  }, [testimonialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateTestimonialFormData> = {};

    if (formData.clientName && formData.clientName.trim().length < 2) {
      newErrors.clientName = "Reviewer name must be at least 2 characters";
    }

    if (formData.testimonial && !formData.testimonial.trim()) {
      newErrors.testimonial = "Review text cannot be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload: UpdateTestimonialFormData = {
        ...formData,
        rating: Number(formData.rating) || 5,
        reviewDate: formData.reviewDate
          ? new Date(formData.reviewDate).toISOString()
          : undefined,
      };

      const res = await updateTestimonial({
        testimonialId: selectedTestimonialId!,
        testimonialData: payload,
      });

      if (res && res.success) {
        toast.success(res.message || "Review updated successfully");
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        dispatch(closeEditTestimonialForm());
      } else {
        toast.error(res?.message || "Failed to update review");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    dispatch(closeEditTestimonialForm());
  };

  if (isLoading) {
    return <FormLoading />;
  }

  const activeRating = hoverRating !== null ? hoverRating : formData.rating || 5;

  return (
    <div className="p-6 rounded-lg shadow-sm border max-w-2xl mx-auto bg-card text-card-foreground">
      <div className="flex items-center justify-between pb-4 mb-4 border-b">
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 shrink-0"
            style={{
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJubm96ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          />
          <div>
            <h2 className="text-xl font-semibold">Edit Google Review</h2>
            <p className="text-xs text-muted-foreground">
              Modify reviewer details, rating, review timestamp, or visibility.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Reviewer Name & Designation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Reviewer Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              placeholder="e.g. Anagha T. S"
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation / Tag</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              placeholder="e.g. Google Reviewer"
            />
          </div>
        </div>

        {/* Rating & Review Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Star Rating Picker */}
          <div className="space-y-2">
            <Label>Rating ({formData.rating || 5} / 5 Stars)</Label>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 rounded hover:scale-110 transition-transform focus:outline-none"
                  title={`${star} Star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= activeRating
                        ? "fill-[#fbbc04] text-[#fbbc04]"
                        : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-semibold ml-2 text-[#fbbc04]">
                {formData.rating || 5}.0
              </span>
            </div>
          </div>

          {/* Review Date and Time */}
          <div className="space-y-2">
            <Label htmlFor="reviewDate">Review Date & Time</Label>
            <Input
              id="reviewDate"
              type="datetime-local"
              value={formData.reviewDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, reviewDate: e.target.value })
              }
            />
            <p className="text-[11px] text-muted-foreground">
              Timestamp of when this review was posted on Google.
            </p>
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="testimonial">Review Content</Label>
          <Textarea
            id="testimonial"
            rows={4}
            value={formData.testimonial}
            onChange={(e) =>
              setFormData({ ...formData, testimonial: e.target.value })
            }
            placeholder="Enter review content..."
          />
          {errors.testimonial && (
            <p className="text-red-500 text-xs mt-1">{errors.testimonial}</p>
          )}
        </div>

        {/* Visibility Switch */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40">
          <div>
            <Label htmlFor="isVisible" className="font-medium cursor-pointer">
              Visible to Public
            </Label>
            <p className="text-xs text-muted-foreground">
              When enabled, this review is displayed dynamically on the user website.
            </p>
          </div>
          <Switch.Root
            className="relative h-[25px] w-[42px] cursor-pointer rounded-full bg-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 data-[state=checked]:bg-blue-600 transition-colors"
            id="isVisible"
            checked={formData.isVisible}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isVisible: checked })
            }
          >
            <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-sm transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTestimonialForm;

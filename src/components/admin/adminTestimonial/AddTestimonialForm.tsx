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
import { Star } from "lucide-react";

const getNowLocalDateTime = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const AddTestimonialForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateTestimonialFormData>({
    clientName: "",
    designation: "",
    testimonial: "",
    rating: 5,
    reviewDate: getNowLocalDateTime(),
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<CreateTestimonialFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      clientName: "",
      designation: "",
      testimonial: "",
      rating: 5,
      reviewDate: getNowLocalDateTime(),
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTestimonialFormData> = {};

    if (!formData.clientName?.trim()) {
      newErrors.clientName = "Reviewer name is required";
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = "Reviewer name must be at least 2 characters";
    }

    if (!formData.testimonial?.trim()) {
      newErrors.testimonial = "Review text is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    dispatch(toggleAddTestimonialForm());
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload: CreateTestimonialFormData = {
        ...formData,
        designation: formData.designation?.trim() || "Google Reviewer",
        rating: Number(formData.rating) || 5,
        reviewDate: formData.reviewDate
          ? new Date(formData.reviewDate).toISOString()
          : new Date().toISOString(),
      };

      const res = await createTestimonial(payload);
      if (res && res.success) {
        toast.success(res.message || "Google review added successfully");
        handleCancel();
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      } else {
        toast.error(res?.message || "Failed to add Google review");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Review adding failed");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h2 className="text-xl font-semibold">Add Google Review</h2>
            <p className="text-xs text-muted-foreground">
              Add a new Google review with reviewer name, rating, date & time, and review comments.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Reviewer Name & Designation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">
              Reviewer Name <span className="text-red-500">*</span>
            </Label>
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
            {errors.designation && (
              <p className="text-red-500 text-xs mt-1">{errors.designation}</p>
            )}
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
              Select when the review was posted on Google.
            </p>
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="testimonial">
            Review Content <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="testimonial"
            rows={4}
            value={formData.testimonial}
            onChange={(e) =>
              setFormData({ ...formData, testimonial: e.target.value })
            }
            placeholder="e.g. Good service 🙈❤️"
          />
          {errors.testimonial && (
            <p className="text-red-500 text-xs mt-1">{errors.testimonial}</p>
          )}
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
            {isSubmitting ? "Adding Review..." : "Add Google Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTestimonialForm;

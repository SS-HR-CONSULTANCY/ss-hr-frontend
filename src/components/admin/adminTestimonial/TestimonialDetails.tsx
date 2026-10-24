import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import FormLoading from "../../form/FormLoading";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { Star } from "lucide-react";

import { getTestimonialById } from "@/utils/apis/adminTestimonialApi";
import { closeViewTestimonialDetails } from "@/store/slices/testimonialSlice";

dayjs.extend(relativeTime);

const TestimonialDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTestimonialId } = useSelector(
    (state: RootState) => state.testimonial,
  );

  const { data: testimonialData, isLoading } = useQuery({
    queryKey: ["testimonial", selectedTestimonialId],
    queryFn: () => getTestimonialById(selectedTestimonialId!),
    enabled: !!selectedTestimonialId,
  });

  const handleClose = () => {
    dispatch(closeViewTestimonialDetails());
  };

  if (isLoading) {
    return <FormLoading />;
  }

  if (!testimonialData?.testimonial) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">Review not found</p>
          <p className="text-gray-600 mt-2">
            The requested review could not be loaded.
          </p>
          <Button onClick={handleClose} className="mt-4" variant="outline">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const { testimonial } = testimonialData;
  const rating = testimonial.rating ?? 5;
  const reviewDate = testimonial.reviewDate || testimonial.createdAt;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-card text-card-foreground">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 shrink-0"
            style={{
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJubm96ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          />
          <h2 className="text-xl font-semibold">Google Review Details</h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            testimonial.isVisible
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {testimonial.isVisible ? "Visible to Public" : "Hidden"}
        </span>
      </div>

      <div className="space-y-6">
        {/* Reviewer Information Card */}
        <div className="p-4 border rounded-lg bg-muted/20">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Reviewer Profile
          </h3>
          <div className="flex items-center gap-4">
            {testimonial.clientPhoto ? (
              <img
                src={testimonial.clientPhoto}
                alt={testimonial.clientName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm border border-zinc-200 dark:border-zinc-700"
                onError={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.display = "none";
                  const sibling = target.nextElementSibling as HTMLElement;
                  if (sibling) {
                    sibling.style.display = "flex";
                    sibling.classList.remove("hidden");
                  }
                }}
              />
            ) : null}
            <div
              className={`items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg shrink-0 shadow-sm ${
                testimonial.clientPhoto ? "hidden" : "flex"
              }`}
            >
              {testimonial.clientName?.charAt(0)?.toUpperCase() || "G"}
            </div>
            <div>
              <h4 className="text-lg font-semibold">
                {testimonial.clientName}
              </h4>
              {testimonial.designation &&
                testimonial.designation.trim() !==
                  "Client of SS HR Tours & Travels" && (
                  <p className="text-sm text-muted-foreground">
                    {testimonial.designation}
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Rating & Timestamp Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Rating
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < rating
                        ? "fill-[#fbbc04] text-[#fbbc04]"
                        : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-base font-bold text-[#fbbc04]">
                {rating}.0
              </span>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Review Date & Time
            </h3>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {dayjs(reviewDate).format("DD MMM YYYY, hh:mm A")}
              </span>
              <span className="text-xs text-muted-foreground">
                ({dayjs(reviewDate).fromNow()})
              </span>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Review Content
          </h3>
          <div className="p-4 border rounded-lg bg-card border-l-4 border-l-blue-500">
            <p className="leading-relaxed whitespace-pre-wrap">
              "{testimonial.testimonial}"
            </p>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end pt-6 border-t mt-6">
        <Button onClick={handleClose} variant="outline">
          Close
        </Button>
      </div>
    </div>
  );
};

export default TestimonialDetails;

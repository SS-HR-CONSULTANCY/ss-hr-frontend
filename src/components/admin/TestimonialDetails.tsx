import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { RootState, AppDispatch } from "@/store/store";
import { closeViewTestimonialDetails } from "@/store/slices/testimonialSlice";
import { getTestimonialById } from "@/utils/apis/adminTestimonialApi";
import noProfile from '@/assets/defaultImgaes/noProfile.png';
import FormLoading from "../form/FormLoading";

const TestimonialDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTestimonialId } = useSelector((state: RootState) => state.testimonial);

  const { data: testimonialData, isLoading } = useQuery({
    queryKey: ["testimonial", selectedTestimonialId],
    queryFn: () => getTestimonialById(selectedTestimonialId!),
    enabled: !!selectedTestimonialId,
  });

  const handleClose = () => {
    dispatch(closeViewTestimonialDetails());
  };

  if (isLoading) {
    return (
      <FormLoading />
    );
  }

  console.log("data : ",testimonialData)

  if (!testimonialData?.testimonial) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">Testimonial not found</p>
          <p className="text-gray-600 mt-2">The requested testimonial could not be loaded.</p>
          <Button onClick={handleClose} className="mt-4" variant="outline">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const { testimonial } = testimonialData;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold ">Testimonial Details</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          testimonial.isVisible 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {testimonial.isVisible ? "Visible" : "Hidden"}
        </span>
      </div>

      <div className="space-y-6">
        <div className="p-4 border  rounded-lg">
          <h3 className="text-sm font-medium  mb-3">Client Information</h3>
          <div className="flex items-center gap-4">
            <img
              src={testimonial.clientPhoto || noProfile}
              alt={testimonial.clientName}
              className="w-16 h-16 rounded-full object-cover border"
              onError={(e) => {
                e.currentTarget.src = noProfile;
              }}
            />
            <div>
              <h4 className="text-lg font-semibold ">{testimonial.clientName}</h4>
              <p className="font-medium">{testimonial.designation}</p>
            </div>
          </div>
        </div>

        {/* Testimonial Content */}
        <div>
          <h3 className="text-sm font-medium mb-2">Client Testimonial</h3>
          <div className="p-4 border rounded-lg border-l-4">
            <p className="leading-relaxed italic">
              "{testimonial.testimonial}"
            </p>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleClose}
          variant="outline"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default TestimonialDetails;
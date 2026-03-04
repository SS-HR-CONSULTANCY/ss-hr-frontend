import { axiosInstance } from "@/lib/axios";
import type { Testimonial } from "@/types/entities/testimonial";

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const response = await axiosInstance.get("/user/testimonials");
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error("Failed to fetch testimonials");
};

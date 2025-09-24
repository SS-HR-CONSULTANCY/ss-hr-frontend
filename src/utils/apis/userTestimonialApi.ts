import type { Testimonial } from "@/types/entities/testimonial";

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
    const response = await fetch("/user/testimonials");
    if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
    }
    const result = await response.json();
    return result.data as Testimonial[];
}
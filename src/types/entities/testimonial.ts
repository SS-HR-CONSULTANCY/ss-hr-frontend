export interface Testimonial {
  _id: string;
  clientName: string;
  clientPhoto: string;
  designation: string;
  testimonial: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialFormData {
  clientName: string;
  clientPhoto: string;
  designation: string;
  testimonial: string;
}

export interface UpdateTestimonialFormData {
  clientName?: string;
  clientPhoto?: string;
  designation?: string;
  testimonial?: string;
  isVisible?: boolean;
}
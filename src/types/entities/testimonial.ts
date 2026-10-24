export interface Testimonial {
  _id: string;
  clientName: string;
  clientPhoto?: string;
  designation?: string;
  testimonial: string;
  rating?: number;
  reviewDate?: string;
  isVisible: boolean;
  googleReviewId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialFormData {
  clientName: string;
  clientPhoto?: string;
  designation?: string;
  testimonial: string;
  rating?: number;
  reviewDate?: string;
}

export interface UpdateTestimonialFormData {
  clientName?: string;
  clientPhoto?: string;
  designation?: string;
  testimonial?: string;
  rating?: number;
  reviewDate?: string;
  isVisible?: boolean;
}

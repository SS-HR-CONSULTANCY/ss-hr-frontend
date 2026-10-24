
import Heading from "../common/Heading";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { AuroraBackground } from "../ui/aurora-background";
import type { Testimonial } from "@/types/entities/testimonial";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { fetchTestimonials } from "@/utils/apis/userTestimonialApi";
import { staticTestimonials } from "@/utils/constants";

const sortNewestToOldest = (list: Testimonial[]): Testimonial[] => {
  return [...list].sort((a, b) => {
    const timeA = new Date(a.reviewDate || a.createdAt).getTime();
    const timeB = new Date(b.reviewDate || b.createdAt).getTime();
    return timeB - timeA; // Latest to oldest
  });
};

const Reviews: React.FC = () => {
  const [testmonials, setTestimonials] = useState<Testimonial[]>(() =>
    sortNewestToOldest(staticTestimonials as unknown as Testimonial[]),
  );

  const { data, isError, error } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setTestimonials(sortNewestToOldest(data));
    } else if (isError && error) {
      setTestimonials(
        sortNewestToOldest(staticTestimonials as unknown as Testimonial[]),
      );
    }
  }, [data, error, isError]);

  return (
    <section id="reviews" className="pt-16">
      <Heading
        heading="Google Reviews"
        headingDescription="See what our verified clients are saying about us on Google."
        mainDivClassName="text-center mx-auto max-w-2xl"
      />
      <AuroraBackground>
        <div className="relative flex flex-col gap-4 items-center justify-center px-4">
          <div className="relative w-full max-w-screen overflow-hidden">
            <InfiniteMovingCards
              key={testmonials.map((t) => t._id).join("-")}
              items={testmonials || []}
              direction="left"
              speed="slow"
            />
          </div>
        </div>
      </AuroraBackground>
    </section>
  );
};

export default Reviews;

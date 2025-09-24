import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import type { Testimonial } from "@/types/entities/testimonial";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: Testimonial[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => (
          <Card
            key={item._id}
            className="h-auto relative w-[250px] max-w-full shrink-0 
               rounded-2xl border border-b-0 border-zinc-200 
               bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] 
               md:w-[450px] dark:border-zinc-700 
               dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
          >
            <CardContent className="flex flex-col h-full px-4 py-3 md:px-8 md:py-6">
              <blockquote className="flex flex-col h-full">
                <div
                  aria-hidden="true"
                  className="user-select-none pointer-events-none absolute 
                     -top-0.5 -left-0.5 -z-1 
                     h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>

                {/* Quote text */}
                <span className="relative z-20 text-sm leading-[1.6] font-normal text-black dark:text-white">
                  {item.testimonial}
                </span>

                {/* Footer at bottom */}
                <div className="relative z-20 mt-auto flex flex-row items-center pt-6">
                  <span className="flex flex-col gap-1">
                    <span className="text-sm leading-[1.6] font-semibold text-black dark:text-white">
                      {item.clientName}
                    </span>
                    <span className="text-sm leading-[1.6] font-normal text-gray-500 dark:text-gray-300">
                      {item.designation}
                    </span>
                  </span>
                </div>
              </blockquote>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
};
